import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import React, { useState } from "react";

// 🔥 Hooks
import { useCreateCategory } from "../../hooks/Category/useCreateCategory";
import { useDeleteCategory } from "../../hooks/Category/useDeleteCategory";
import { useGetCategories } from "../../hooks/Category/useGetCategories";
import { useUpdateCategory } from "../../hooks/Category/useUpdateCategory";

const uploadToCloudinary = async (file: File) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "frontendfileupload");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dhuddbzui/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  if (!res.ok) throw new Error("Upload failed");

  const result = await res.json();
  return result.secure_url;
};

interface Category {
  id: number;
  name: string;
  Description: string;
  image: string;
  status: "ACTIVE" | "INACTIVE";
}

interface CategoryForm {
  name: string;
  description: string;
  status: "Active" | "Pending";
  imageFile: File | null;
  imagePreview: string;
}

const CategoryManagement: React.FC = () => {
  const { data, isLoading } = useGetCategories(1, 10);
  const categories = data?.data?.data || [];

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const [category, setCategory] = useState<CategoryForm>({
    name: "",
    description: "",
    status: "Active",
    imageFile: null,
    imagePreview: "",
  });

  /* ================= IMAGE ================= */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCategory((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  /* ================= CREATE ================= */

  const addCategory = async () => {
    if (!category.name || !category.imageFile) return;

    try {
      setUploading(true);

      const imageUrl = await uploadToCloudinary(category.imageFile);

      createMutation.mutate({
        name: category.name,
        Description: category.description,
        image: imageUrl,
      });

      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  /* ================= UPDATE ================= */

  const updateCategory = async () => {
    if (editingId === null) return;

    try {
      setUploading(true);

      let imageUrl = category.imagePreview;

      if (category.imageFile) {
        imageUrl = await uploadToCloudinary(category.imageFile);
      }

      updateMutation.mutate({
        id: editingId,
        payload: {
          name: category.name,
          Description: category.description,
          image: imageUrl,
          status: category.status === "Active" ? "ACTIVE" : "INACTIVE",
        },
      });

      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  /* ================= DELETE ================= */

  const deleteCategory = (id: number) => {
    deleteMutation.mutate(id);
  };

  /* ================= EDIT ================= */

  const editCategory = (cat: Category) => {
    setEditingId(cat.id);

    setCategory({
      name: cat.name,
      description: cat.Description,
      status: cat.status === "ACTIVE" ? "Active" : "Pending",
      imageFile: null,
      imagePreview: cat.image,
    });

    setOpenDialog(true);
  };

  /* ================= RESET ================= */

  const resetForm = () => {
    setCategory({
      name: "",
      description: "",
      status: "Active",
      imageFile: null,
      imagePreview: "",
    });

    setEditingId(null);
    setOpenDialog(false);
  };

  /* ================= LOADING ================= */

  if (isLoading) return <p>Loading...</p>;

  /* ================= UI ================= */

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Category Management
      </Typography>

      <Card>
        <CardContent>

          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Categories</Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Add Category
            </Button>
          </Stack>

          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categories.map((cat: Category) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <Avatar src={cat.image}>
                      <ImageIcon />
                    </Avatar>
                  </TableCell>

                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.Description}</TableCell>
                  <TableCell>{cat.status}</TableCell>

                  <TableCell align="right">
                    <IconButton onClick={() => editCategory(cat)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => deleteCategory(cat.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </CardContent>
      </Card>

      {/* DIALOG */}

      <Dialog open={openDialog} onClose={resetForm} fullWidth>
        <DialogTitle>
          {editingId ? "Edit Category" : "Add Category"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>

            <Avatar src={category.imagePreview} sx={{ width: 80, height: 80 }}>
              <ImageIcon />
            </Avatar>

            <Button component="label">
              Upload Image
              <input hidden type="file" onChange={handleImageChange} />
            </Button>

            <TextField
              label="Name"
              value={category.name}
              onChange={(e) =>
                setCategory({ ...category, name: e.target.value })
              }
            />

            <TextField
              label="Description"
              value={category.description}
              onChange={(e) =>
                setCategory({ ...category, description: e.target.value })
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={resetForm}>Cancel</Button>

          <Button
            variant="contained"
            disabled={uploading}
            onClick={editingId ? updateCategory : addCategory}
          >
            {uploading ? "Uploading..." : editingId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;