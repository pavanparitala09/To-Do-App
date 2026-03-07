import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Health check
app.get("/health", (req, res) => {
  res.send("Server is running");
});

// ✅ Get all todos
app.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("todoitems")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// ✅ Add a todo
app.post("/add-item", async (req, res) => {
  const { text } = req.body;

  if (!text || text.length < 3) {
    return res.status(400).json({ error: "Text is too short" });
  }

  const { error } = await supabase
    .from("todoitems")
    .insert([{ itemdescription: text }]);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.send("Added successfully");
});

// ✅ Edit a todo
app.put("/edit-item", async (req, res) => {
  const { ID, itemdescription } = req.body;

  const { error } = await supabase
    .from("todoitems")
    .update({ itemdescription })
    .eq("id", ID);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.send("Updated successfully");
});

// ✅ Delete a todo
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("todoitems")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.send("Deleted successfully");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

//error handiling middleware
app.use((err, req, res, next) => {
  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors,
    });
  }
  // Invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }
  // Duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate field value",
    });
  }
  res.status(500).json({
    message: "Internal Server Error",
  });
});
