import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutDashboard, Save } from "lucide-react";

const AdminInventoryPage = () => {
  const { products, updateStock } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <main className="flex-grow container py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon"><LayoutDashboard size={20} /></Button>
            </Link>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Update Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>
                    <span className={`font-bold ${
                      product.stockQuantity === 0 ? 'text-destructive' : 
                      product.stockQuantity < 5 ? 'text-amber-600' : 'text-foreground'
                    }`}>
                      {product.stockQuantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.stockQuantity === 0 ? (
                      <span className="text-xs font-bold text-destructive uppercase">Out of Stock</span>
                    ) : product.stockQuantity < 5 ? (
                      <span className="text-xs font-bold text-amber-600 uppercase">Low Stock</span>
                    ) : (
                      <span className="text-xs font-bold text-green-600 uppercase">Healthy</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Input 
                        type="number" 
                        className="w-20 h-8" 
                        defaultValue={product.stockQuantity}
                        onBlur={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                      />
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Save size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default AdminInventoryPage;