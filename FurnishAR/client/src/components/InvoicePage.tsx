import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateInvoicePDF } from "@/lib/pdfGenerator";
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Mail, 
  Edit3, 
  Plus, 
  Trash2,
  Calculator,
  FileText
} from "lucide-react";
import { Project } from "@shared/schema";

interface InvoiceItem {
  id: number;
  name: string;
  category: string;
  sku: string;
  material: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoicePageProps {
  project: Project;
  onClose: () => void;
}

export default function InvoicePage({ project, onClose }: InvoicePageProps) {
  const { toast } = useToast();
  
  const [invoiceData, setInvoiceData] = useState({
    number: `INV-${project.id}-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: "Thank you for choosing FURNISH-AR for your interior design needs.",
    taxRate: 0.08, // 8% tax
  });

  // Generate invoice items from project furniture
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(() => {
    if (!Array.isArray(project.furniture)) return [];
    
    return project.furniture.map((item: any, index: number) => {
      // Mock pricing based on furniture type and properties
      const basePrice = 299 + (index * 150); // Varied pricing
      const materialMultiplier = item.texture === 'marble' ? 1.5 : item.texture === 'wood' ? 1.2 : 1.0;
      const unitPrice = Math.round(basePrice * materialMultiplier);
      
      interface ProjectFurnitureItem {
        id: number;
        texture?: string;
        color?: string;
      }

      const typedProjectFurniture: ProjectFurnitureItem[] = project.furniture as ProjectFurnitureItem[];

      return {
        id: item.id as number,
        name: `Furniture Item ${item.id as number}`,
        category: "Furniture",
        sku: `SKU-${(item.id as number).toString().padStart(4, '0')}`,
        material: (item.texture as string) || "Wood",
        color: (item.color as string) || "Natural",
        size: "Standard",
        quantity: 1,
        unitPrice: unitPrice as number,
        total: unitPrice as number
      };
    });
  });

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * invoiceData.taxRate;
  const total = subtotal + taxAmount;

  const updateItem = (id: number, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now(),
      name: "New Item",
      category: "Furniture",
      sku: `SKU-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      material: "Wood",
      color: "Natural",
      size: "Standard",
      quantity: 1,
      unitPrice: 299,
      total: 299
    };
    setInvoiceItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: number) => {
    setInvoiceItems(prev => prev.filter(item => item.id !== id));
  };

  const handleDownloadPDF = () => {
    generateInvoicePDF(project, invoiceItems);
    toast({ title: "Invoice PDF downloaded successfully!" });
  };

  const handleSendEmail = () => {
    // Simulate email sending
    toast({ 
      title: "Invoice sent!", 
      description: `Invoice sent to ${project.clientName}'s email address.`
    });
  };

  const handlePrint = () => {
    window.print();
    toast({ title: "Print dialog opened" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-50 to-blue-50 dark:from-midnight-900 dark:to-midnight-800 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 no-print">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Project</span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleSendEmail} variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Invoice */}
        <Card className="glassmorphism border shadow-lg">
          <CardHeader className="border-b border-midnight-200 dark:border-midnight-600">
            {/* Company Header */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-midnight-800 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">FA</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-midnight-800 dark:text-white">
                      FURNISH-AR
                    </h1>
                    <p className="text-midnight-600 dark:text-midnight-400 text-sm">
                      Professional Interior Design Platform
                    </p>
                  </div>
                </div>
                <div className="text-sm text-midnight-600 dark:text-midnight-400">
                  <p>123 Design Street</p>
                  <p>Design City, DC 12345</p>
                  <p>contact@furnish-ar.com</p>
                  <p>(555) 123-4567</p>
                </div>
              </div>
              
              <div className="text-right">
                <h2 className="text-3xl font-bold text-midnight-800 dark:text-white mb-4">
                  INVOICE
                </h2>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between min-w-[200px]">
                    <span className="text-midnight-600 dark:text-midnight-400">Invoice #:</span>
                    <span className="font-medium text-midnight-800 dark:text-white">
                      {invoiceData.number}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-midnight-600 dark:text-midnight-400">Date:</span>
                    <span className="font-medium text-midnight-800 dark:text-white">
                      {new Date(invoiceData.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-midnight-600 dark:text-midnight-400">Due Date:</span>
                    <span className="font-medium text-midnight-800 dark:text-white">
                      {new Date(invoiceData.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client and Project Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-semibold text-midnight-800 dark:text-white mb-2">Bill To:</h3>
                <div className="text-sm text-midnight-600 dark:text-midnight-400">
                  <p className="font-medium text-lg text-midnight-800 dark:text-white">
                    {project.clientName}
                  </p>
                  <p>123 Client Address</p>
                  <p>Client City, CC 54321</p>
                  <p>client@email.com</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-midnight-800 dark:text-white mb-2">Project Details:</h3>
                <div className="text-sm text-midnight-600 dark:text-midnight-400">
                  <p><span className="font-medium">Project:</span> {project.name}</p>
                  <p><span className="font-medium">Room Type:</span> {project.roomType}</p>
                  <p><span className="font-medium">Dimensions:</span> {project.dimensions?.length}' × {project.dimensions?.width}' × {project.dimensions?.height}'</p>
                  <p><span className="font-medium">Status:</span> 
                    <Badge className="ml-2 capitalize" variant="secondary">
                      {project.status}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Items Table */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-midnight-800 dark:text-white flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Invoice Items
                </h3>
                <Button 
                  onClick={addItem} 
                  variant="outline" 
                  size="sm" 
                  className="no-print"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-midnight-200 dark:border-midnight-600">
                      <th className="text-left py-3 font-medium text-midnight-700 dark:text-midnight-300">Item</th>
                      <th className="text-left py-3 font-medium text-midnight-700 dark:text-midnight-300">SKU</th>
                      <th className="text-left py-3 font-medium text-midnight-700 dark:text-midnight-300">Material</th>
                      <th className="text-left py-3 font-medium text-midnight-700 dark:text-midnight-300">Color</th>
                      <th className="text-center py-3 font-medium text-midnight-700 dark:text-midnight-300">Qty</th>
                      <th className="text-right py-3 font-medium text-midnight-700 dark:text-midnight-300">Unit Price</th>
                      <th className="text-right py-3 font-medium text-midnight-700 dark:text-midnight-300">Total</th>
                      <th className="w-12 no-print"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item) => (
                      <tr key={item.id} className="border-b border-midnight-100 dark:border-midnight-700">
                        <td className="py-3">
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            className="border-none p-0 h-auto bg-transparent text-midnight-800 dark:text-white print:border-none print:shadow-none"
                          />
                        </td>
                        <td className="py-3">
                          <Input
                            value={item.sku}
                            onChange={(e) => updateItem(item.id, 'sku', e.target.value)}
                            className="border-none p-0 h-auto bg-transparent text-midnight-600 dark:text-midnight-400 print:border-none"
                          />
                        </td>
                        <td className="py-3">
                          <Input
                            value={item.material}
                            onChange={(e) => updateItem(item.id, 'material', e.target.value)}
                            className="border-none p-0 h-auto bg-transparent text-midnight-600 dark:text-midnight-400 print:border-none"
                          />
                        </td>
                        <td className="py-3">
                          <Input
                            value={item.color}
                            onChange={(e) => updateItem(item.id, 'color', e.target.value)}
                            className="border-none p-0 h-auto bg-transparent text-midnight-600 dark:text-midnight-400 print:border-none"
                          />
                        </td>
                        <td className="py-3 text-center">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="border-none p-0 h-auto bg-transparent text-center text-midnight-800 dark:text-white w-16 print:border-none"
                            min="1"
                          />
                        </td>
                        <td className="py-3 text-right">
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="border-none p-0 h-auto bg-transparent text-right text-midnight-800 dark:text-white w-20 print:border-none"
                            step="0.01"
                          />
                        </td>
                        <td className="py-3 text-right font-medium text-midnight-800 dark:text-white">
                          ${item.total.toFixed(2)}
                        </td>
                        <td className="py-3 no-print">
                          <Button
                            onClick={() => removeItem(item.id)}
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="flex justify-end mt-6">
              <div className="w-full max-w-sm">
                <div className="space-y-2">
                  <div className="flex justify-between text-midnight-600 dark:text-midnight-400">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-midnight-600 dark:text-midnight-400">
                    <span>Tax ({(invoiceData.taxRate * 100).toFixed(0)}%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-midnight-800 dark:text-white">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-8">
              <Label htmlFor="notes" className="text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2 block">
                Notes & Terms
              </Label>
              <textarea
                id="notes"
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-3 bg-white dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-midnight-700 dark:text-midnight-300 print:border-none print:bg-transparent"
                rows={3}
                placeholder="Add payment terms, notes, or special instructions..."
              />
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-midnight-200 dark:border-midnight-600 text-center">
              <p className="text-xs text-midnight-500 dark:text-midnight-400">
                Thank you for choosing FURNISH-AR for your interior design needs.
              </p>
              <p className="text-xs text-midnight-500 dark:text-midnight-400 mt-1">
                For questions about this invoice, please contact support@furnish-ar.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
