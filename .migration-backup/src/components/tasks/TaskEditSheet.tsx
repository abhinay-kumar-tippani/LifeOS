"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Task } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  due_date: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
});

type Values = z.infer<typeof schema>;

export function TaskEditSheet({
  open,
  onOpenChange,
  task,
  onUpdate,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  task: Task | null;
  onUpdate: (id: string, patch: Partial<Task>) => Promise<{ error: string | null }>;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      due_date: "",
      status: "todo",
    },
  });

  useEffect(() => {
    if (open && task) {
      form.reset({
        title: task.title ?? "",
        description: task.description ?? "",
        priority: task.priority,
        due_date: task.due_date ?? "",
        status: task.status,
      });
    }
  }, [open, task, form]);

  async function submit(values: Values) {
    if (!task) return;
    const patch: Partial<Task> = {
      title: values.title,
      description: values.description ?? null,
      priority: values.priority,
      due_date: values.due_date || null,
      status: values.status,
    };
    const { error } = await onUpdate(task.id, patch);
    if (!error) onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-6 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit task</SheetTitle>
          <SheetDescription>Update task details. Changes save immediately.</SheetDescription>
        </SheetHeader>
        {task ? (
          <Form {...form}>
            <form
              id="task-edit-form"
              onSubmit={form.handleSubmit(submit)}
              className="flex flex-1 flex-col gap-4 overflow-y-auto px-1"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Column</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        ) : null}
        <SheetFooter className="border-t pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="task-edit-form" disabled={form.formState.isSubmitting}>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}