import jsPDF from 'jspdf';
import { Project } from '@shared/schema';

interface InvoiceItem {
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

export function generateInvoicePDF(project: Project, items: InvoiceItem[]): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = 20;

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('FURNISH-AR', 20, yPosition);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Interior Design Platform', 20, yPosition + 8);
  
  // Invoice title
  yPosition += 25;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJECT INVOICE', 20, yPosition);
  
  // Project details
  yPosition += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project: ${project.name}`, 20, yPosition);
  doc.text(`Client: ${project.clientName}`, 20, yPosition + 6);
  doc.text(`Room Type: ${project.roomType}`, 20, yPosition + 12);
  doc.text(`Dimensions: ${project.dimensions?.length}' × ${project.dimensions?.width}' × ${project.dimensions?.height}'`, 20, yPosition + 18);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 80, yPosition);
  doc.text(`Invoice #: INV-${project.id}-${Date.now().toString().slice(-6)}`, pageWidth - 80, yPosition + 6);

  // Line separator
  yPosition += 30;
  doc.line(20, yPosition, pageWidth - 20, yPosition);

  // Table headers
  yPosition += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 20, yPosition);
  doc.text('SKU', 60, yPosition);
  doc.text('Material', 85, yPosition);
  doc.text('Color', 115, yPosition);
  doc.text('Qty', 140, yPosition);
  doc.text('Unit Price', 155, yPosition);
  doc.text('Total', pageWidth - 40, yPosition);

  // Table line
  yPosition += 2;
  doc.line(20, yPosition, pageWidth - 20, yPosition);

  // Items
  doc.setFont('helvetica', 'normal');
  let subtotal = 0;

  items.forEach((item, index) => {
    yPosition += 8;
    
    // Check if we need a new page
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    doc.text(item.name, 20, yPosition);
    doc.text(item.sku, 60, yPosition);
    doc.text(item.material, 85, yPosition);
    doc.text(item.color, 115, yPosition);
    doc.text(item.quantity.toString(), 140, yPosition);
    doc.text(`$${item.unitPrice.toFixed(2)}`, 155, yPosition);
    doc.text(`$${item.total.toFixed(2)}`, pageWidth - 40, yPosition);
    
    subtotal += item.total;
  });

  // Totals section
  yPosition += 15;
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  
  yPosition += 10;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  doc.text('Subtotal:', pageWidth - 80, yPosition);
  doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 40, yPosition);
  
  yPosition += 6;
  doc.text('Tax (8%):', pageWidth - 80, yPosition);
  doc.text(`$${tax.toFixed(2)}`, pageWidth - 40, yPosition);
  
  yPosition += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', pageWidth - 80, yPosition);
  doc.text(`$${total.toFixed(2)}`, pageWidth - 40, yPosition);

  // Footer
  yPosition += 25;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Thank you for choosing FURNISH-AR for your interior design needs.', 20, yPosition);
  doc.text('For questions about this invoice, please contact support@furnish-ar.com', 20, yPosition + 4);
  
  // Download the PDF
  doc.save(`FURNISH-AR-Invoice-${project.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function generateProjectReport(project: Project): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJECT REPORT', 20, yPosition);
  
  // Project details
  yPosition += 20;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project Name: ${project.name}`, 20, yPosition);
  doc.text(`Client: ${project.clientName}`, 20, yPosition + 8);
  doc.text(`Room Type: ${project.roomType}`, 20, yPosition + 16);
  doc.text(`Status: ${project.status}`, 20, yPosition + 24);
  doc.text(`Created: ${new Date(project.createdAt).toLocaleDateString()}`, 20, yPosition + 32);
  doc.text(`Last Updated: ${new Date(project.updatedAt).toLocaleDateString()}`, 20, yPosition + 40);

  // Room specifications
  yPosition += 55;
  doc.setFont('helvetica', 'bold');
  doc.text('ROOM SPECIFICATIONS', 20, yPosition);
  
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  if (project.dimensions) {
    doc.text(`Length: ${project.dimensions.length} feet`, 20, yPosition);
    doc.text(`Width: ${project.dimensions.width} feet`, 20, yPosition + 8);
    doc.text(`Height: ${project.dimensions.height} feet`, 20, yPosition + 16);
    doc.text(`Total Area: ${project.dimensions.length * project.dimensions.width} sq ft`, 20, yPosition + 24);
  }

  // Household information
  yPosition += 40;
  doc.setFont('helvetica', 'bold');
  doc.text('HOUSEHOLD INFORMATION', 20, yPosition);
  
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  if (project.household) {
    doc.text(`Children: ${project.household.children ? 'Yes' : 'No'}`, 20, yPosition);
    doc.text(`Pets: ${project.household.pets ? 'Yes' : 'No'}`, 20, yPosition + 8);
    doc.text(`Senior Citizens: ${project.household.seniors ? 'Yes' : 'No'}`, 20, yPosition + 16);
  }

  // Furniture list
  yPosition += 30;
  doc.setFont('helvetica', 'bold');
  doc.text('FURNITURE ITEMS', 20, yPosition);
  
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  if (Array.isArray(project.furniture) && project.furniture.length > 0) {
    project.furniture.forEach((item: any, index: number) => {
      doc.text(`${index + 1}. Item ID: ${item.id} - Color: ${item.color} - Texture: ${item.texture}`, 20, yPosition);
      yPosition += 6;
    });
  } else {
    doc.text('No furniture items added yet.', 20, yPosition);
  }

  // Vastu compliance
  yPosition += 20;
  doc.setFont('helvetica', 'bold');
  doc.text('VASTU COMPLIANCE', 20, yPosition);
  
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  doc.text(`Vastu Mode: ${project.vastuEnabled ? 'Enabled' : 'Disabled'}`, 20, yPosition);
  
  if (project.vastuEnabled) {
    doc.text('• Room follows traditional Vastu principles', 20, yPosition + 8);
    doc.text('• Furniture placement optimized for positive energy flow', 20, yPosition + 16);
    doc.text('• Directional guidelines have been considered', 20, yPosition + 24);
  }

  // Download the PDF
  doc.save(`FURNISH-AR-Report-${project.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
}
