import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

import { createProduct, deleteProduct, updateProduct } from "@/libs/products";

interface EditButtonsProps {
  newProduct: Product;
  onCancel: () => void;
  onSave?: () => void;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  oldProduct?: Product;
  markErrors: React.Dispatch<React.SetStateAction<string[]>>;
  newItem: boolean | undefined;
}

export default function EditButtons({
  onCancel,
  setEditing,
  onSave,
  newItem = false,
  newProduct,
  markErrors,
  oldProduct = undefined,
}: EditButtonsProps) {
  const router = useRouter();
  const currentPath = usePathname();
  const { data: session, status } = useSession();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const atEditPath = currentPath.endsWith("/edit");

  useEffect(() => {
    if (atEditPath) {
      if (
        (status === "authenticated" && session?.user.role === "admin") ||
        newItem
      ) {
        setEditing(true);
        return;
      }
      setEditing(false);
      router.push(currentPath.replace(/\/edit$/, ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    // console.log("Old Product:", oldProduct as Product);
    // console.log("New Product:", newProduct as Product);

    let isDifferent = false;
    if (oldProduct != undefined) {
      for (const key in newProduct) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((newProduct as any)[key] !== (oldProduct as any)[key]) {
          // console.log(`Difference found in key "${key}":`, {
          //   old: (oldProduct as any)[key],
          //   new: (newProduct as any)[key],
          // });
          isDifferent = true;
        }
      }
    }

    if (!isDifferent && !newItem) {
      setSnackbarMessage("No changes detected. Product not saved.");
      setSnackbarOpen(true);
      return;
    }

    let success, data, error;
    markErrors([]);
    if (newItem) {
      const p = { ...newProduct, id: undefined, _id: undefined };
      ({ success, data, error } = await createProduct(
        session?.user?.token as string,
        p,
      ));
    } else {
      console.log("Updating product with ID:", oldProduct!.id || newProduct.id);
      ({ success, data, error } = await updateProduct(
        session?.user?.token as string,
        newProduct.id || oldProduct!.id!,
        newProduct,
      ));
    }

    if (success) {
      setSnackbarMessage(
        `Product "${data.name}" ${newItem ? "created" : "updated"} successfully.`,
      );
      setSnackbarOpen(true);
      if (setEditing && !newItem) setEditing(false);
      if (onSave) onSave();
      router.push(`/inventory/${data.id}`);
    } else if (error) {
      const errorFields = (error as string).includes("dup key:")
        ? (error as string)
            .match(/dup key: { (.+) }/)?.[1]
            .split(/,\s*/)
            .map((s) => s.split(":")[0].trim()) || []
        : (error as string)
            .replace(/^[A-Za-z ]*failed:\s*/, "")
            .split(/,\s*/)
            .map((s) => s.split(":")[0].trim())
            .filter(Boolean);
      markErrors(errorFields);
      console.log("Validation errors in fields:", errorFields);

      setSnackbarMessage(
        `Failed to save product. Please check the highlighted fields.`,
      );
    } else {
      setSnackbarMessage(
        `An unexpected error occurred while saving the product.`,
      );

      setSnackbarOpen(true);
    }
  };

  const handleDelete = async () => {
    await deleteProduct(
      session?.user?.token as string,
      newProduct.id || oldProduct!.id!,
    );

    setSnackbarMessage(
      `Product "${oldProduct?.name || newProduct.name}" deleted successfully.`,
    );
    setSnackbarOpen(true);
    setOpenDialog(false);
    setTimeout(() => {
      router.push("/inventory");
    }, 1000);
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "row-reverse",
          gap: 1,
        }}
      >
        {atEditPath || newItem ? (
          <>
            <Button variant="contained" onClick={handleSave}>
              {newItem ? "Create" : "Save"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                if (!newItem) setEditing(false);
                onCancel();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setOpenDialog(true);
              }}
              disabled={newItem}
              sx={{
                mr: "auto",
                color: "error.main",
                borderColor: "error.main",
                display: newItem ? "none" : "inline-flex",
                "&:hover": {
                  borderColor: "error.main",
                  backgroundColor: "error.main",
                  color: "error.contrastText",
                },
              }}
            >
              Delete
            </Button>
          </>
        ) : (
          <Button
            disabled={
              !(status === "authenticated" && session?.user.role === "admin")
            }
            variant="outlined"
            onClick={() => {
              setEditing(true);
              window.history.pushState({}, "", `${currentPath}/edit`);
            }}
          >
            Edit
          </Button>
        )}
      </Box>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="delete-product-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "background.paper",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle>
          Delete Product {oldProduct ? `"${oldProduct.name}"` : ""}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={1000}
        onClose={() => {
          setSnackbarOpen(false);
        }}
      />
    </React.Fragment>
  );
}
