import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useStore } from "../../context/StoreContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, LayoutDashboard } from "lucide-react";

const AdminProductsPage = () => {
  const { products, deleteProduct } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <main className="flex-grow container py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon"><LayoutDashboard size={20} /></Button>
            </Link>
            <h1 className="text-3xl font-bold">Products</h1>
          </div>
          <Button className="gap-2">
            <Plus size={18} /> Add Product
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded bg-muted overflow-hidden border">
                      <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{product.title}</div>
                    <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
                  </TableCell>
                  <TableCell className="text-sm">{product.category}</TableCell>
                  <TableCell className="font-medium">${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                      product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <Trash2 size={16} />
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

export default AdminProductsPage;