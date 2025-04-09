import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MeasurementForm } from "@/components/measurements/measurement-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Measurement } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Measurements() {
  const userId = 1; // Default user ID
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: measurements = [], isLoading } = useQuery({
    queryKey: ['/api/measurements/' + userId],
  });

  const handleDeleteMeasurement = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this measurement?")) {
      try {
        await apiRequest("DELETE", `/api/measurements/${id}`, undefined);
        toast({
          title: "Measurement deleted",
          description: "The measurement has been successfully deleted.",
          variant: "default",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/measurements/' + userId] });
      } catch (error) {
        toast({
          title: "Error deleting measurement",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
      }
    }
  };

  // Prepare data for charts
  const prepareChartData = () => {
    return measurements.slice().reverse().map((measurement: Measurement) => ({
      date: format(new Date(measurement.date), 'MMM d'),
      weight: measurement.weight,
      bodyFat: measurement.bodyFat,
      chest: measurement.chest,
      waist: measurement.waist,
      hips: measurement.hips,
      arms: measurement.arms,
      thighs: measurement.thighs,
    }));
  };

  const chartData = prepareChartData();

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Body Measurements</h1>
            <p className="text-gray-500">Track your physical progress over time</p>
          </div>
          <Button 
            className="mt-4 sm:mt-0" 
            onClick={() => setIsDialogOpen(true)}
          >
            <i className="ri-add-line mr-1"></i> Log Measurements
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-500">Loading measurements...</p>
          </div>
        ) : measurements.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-6 mb-4">
              <i className="ri-ruler-line text-4xl text-primary"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No measurements found</h3>
            <p className="text-gray-500 mb-6">
              Start tracking your body measurements to see your progress over time
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <i className="ri-add-line mr-1"></i> Log Your First Measurement
            </Button>
          </div>
        ) : (
          <>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Weight History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="weight" stroke="#3B82F6" name="Weight (lbs)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Body Measurements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="chest" stroke="#3B82F6" name="Chest" />
                        <Line type="monotone" dataKey="waist" stroke="#EF4444" name="Waist" />
                        <Line type="monotone" dataKey="hips" stroke="#10B981" name="Hips" />
                        <Line type="monotone" dataKey="arms" stroke="#F59E0B" name="Arms" />
                        <Line type="monotone" dataKey="thighs" stroke="#8B5CF6" name="Thighs" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Measurements Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Measurement History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Weight (lbs)</TableHead>
                        <TableHead>Body Fat %</TableHead>
                        <TableHead>Chest</TableHead>
                        <TableHead>Waist</TableHead>
                        <TableHead>Hips</TableHead>
                        <TableHead>Arms</TableHead>
                        <TableHead>Thighs</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {measurements.map((measurement: Measurement) => (
                        <TableRow key={measurement.id}>
                          <TableCell className="font-medium">
                            {format(new Date(measurement.date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>{measurement.weight || '-'}</TableCell>
                          <TableCell>{measurement.bodyFat || '-'}</TableCell>
                          <TableCell>{measurement.chest || '-'}</TableCell>
                          <TableCell>{measurement.waist || '-'}</TableCell>
                          <TableCell>{measurement.hips || '-'}</TableCell>
                          <TableCell>{measurement.arms || '-'}</TableCell>
                          <TableCell>{measurement.thighs || '-'}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 rounded-full"
                              onClick={() => handleDeleteMeasurement(measurement.id)}
                            >
                              <i className="ri-delete-bin-line text-red-500"></i>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <MeasurementForm 
            userId={userId} 
            onSuccess={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
