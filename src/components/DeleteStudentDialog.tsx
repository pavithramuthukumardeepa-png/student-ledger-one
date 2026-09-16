import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DeleteStudentDialog({
  studentName,
  open,
  onOpenChange,
  onConfirm,
  deleting,
}: {
  studentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this student?</AlertDialogTitle>
          <AlertDialogDescription>
            {studentName}&apos;s record will be permanently removed from the database. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
