import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertGoalSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Extend the goal schema for form validation
const goalFormSchema = insertGoalSchema.extend({
  hasDeadline: z.boolean().default(true),
  deadlineDate: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface GoalFormProps {
  userId: number;
  defaultValues?: Partial<GoalFormValues>;
  onSuccess?: () => void;
}

export function GoalForm({ userId, defaultValues, onSuccess }: GoalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  // Set up form with default values
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      userId,
      title: "",
      description: "",
      type: "weight",
      target: 0,
      current: 0,
      unit: "lbs",
      createdAt: new Date().toISOString(),
      completed: false,
      hasDeadline: true,
      deadlineDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0], // 30 days from now
      ...defaultValues,
    },
  });

  // Get values from form to conditionally render fields
  const goalType = form.watch("type");
  const hasDeadline = form.watch("hasDeadline");

  // Update unit when type changes
  useEffect(() => {
    switch (goalType) {
      case "weight":
        form.setValue("unit", "lbs");
        break;
      case "running":
        form.setValue("unit", "minutes");
        break;
      case "frequency":
        form.setValue("unit", "days");
        break;
      default:
        break;
    }
  }, [goalType, form]);

  async function onSubmit(data: GoalFormValues) {
    setIsSubmitting(true);

    try {
      // Prepare the deadline field based on whether the user set one
      const deadline = data.hasDeadline ? new Date(data.deadlineDate!).toISOString() : null;
      
      // Create submission data
      const submissionData = {
        ...data,
        deadline,
      };
      
      // Remove fields not in the schema
      const { hasDeadline, deadlineDate, ...goalData } = submissionData;

      await apiRequest("POST", "/api/goals", goalData);
      
      toast({
        title: "Goal created successfully!",
        description: "Your goal has been set. You can do it!",
        variant: "default",
      });
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/goals/' + userId] });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/goals");
      }
    } catch (error) {
      toast({
        title: "Error creating goal",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Run 5K under 25 minutes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="weight">Weight</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="frequency">Workout Frequency</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="current"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="lbs, miles, minutes, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hasDeadline"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Set a deadline for this goal</FormLabel>
                    <FormDescription>
                      Goals with deadlines help you stay motivated
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {hasDeadline && (
              <FormField
                control={form.control}
                name="deadlineDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Why is this goal important to you?" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/goals")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Goal"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
