import React, { useState } from "react";
import { Collection, Product } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Package } from "lucide-react";
import { showError, showSuccess } from "../../utils/toast";

interface CollectionsManagerProps {
  collections: Collection[];
  products: Product[];
  onAddCollection: (collection: Collection) => void;
  onUpdateCollection: (collection: Collection) => void;
  onDeleteCollection: (id: string) => void;
  onAddProductToCollection: (collectionId: string, productId: string) => void;
  onRemoveProductFromCollection: (collectionId: string, productId: string) => void;
}

const CollectionsManager: React.FC<CollectionsManagerProps> = ({
  collections,
  products,
  onAddCollection,
  onUpdateCollection,
  onDeleteCollection,
  onAddProductToCollection,
  onRemoveProductFromCollection
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: ""
  });
  const [editCollection, setEditCollection] = useState<Collection | null>(null);
  const [selectedProductId, setSelectedProductId] = useState("");

  const handleAddCollection = () => {
    if (!newCollection.name.trim()) {
      showError("Collection name is required");
      return;
    }

    const collection: Collection = {
      id: `COL-${Math.floor(Math.random() * 1000000)}`,
      name: newCollection.name,
      description: newCollection.description,
      productIds: [],
      createdAt: new Date().toISOString()
    };

    onAddCollection(collection);
    setNewCollection({ name: "", description: "" });
    setIsAddDialogOpen(false);
    showSuccess("Collection created successfully");
  };

  const handleUpdateCollection = () => {
    if (!editCollection || !editCollection.name.trim()) {
      showError("Collection name is required");
      return;
    }

    onUpdateCollection(editCollection);
    setEditCollection(null);
    setIsEditDialogOpen(false);
    showSuccess("Collection updated successfully");
  };

  const handleDeleteCollection = (id: string) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      onDeleteCollection(id);
      showSuccess("Collection deleted");
    }
  };

  const handleAddProductToCollection = () => {
    if (!selectedCollection || !selectedProductId) return;

    onAddProductToCollection(selectedCollection.id, selectedProductId);
    setIsAddProductDialogOpen(false);
    setSelectedProductId("");
    showSuccess("Product added to collection");
  };

  const handleRemoveProductFromCollection = (collectionId: string, productId: string) => {
    onRemoveProductFromCollection(collectionId, productId);
    showSuccess("Product removed from collection");
  };

  const getCollectionProducts = (collection: Collection) => {
    return products.filter(p => collection.productIds.includes(p.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Product Collections</h3>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus size={16} /> Create Collection
        </Button>
      </div>

      {collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((collection) => {
            const collectionProducts = getCollectionProducts(collection);
            return (
              <div key={collection.id} className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-slate-900">{collection.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">{collection.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditCollection(collection);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCollection(collection.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      {collectionProducts.length} products
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCollection(collection);
                        setIsAddProductDialogOpen(true);
                      }}
                    >
                      <Plus size={14} /> Add Product
                    </Button>
                  </div>
                  
                  {collectionProducts.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {collectionProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Package size={16} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">
                              {product.title}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveProductFromCollection(collection.id, product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No products in this collection</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-500">No collections yet. Create your first collection to organize products.</p>
        </div>
      )}

      {/* Add Collection Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collectionName">Collection Name</Label>
              <Input
                id="collectionName"
                value={newCollection.name}
                onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                placeholder="e.g., Gaming Essentials"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collectionDescription">Description</Label>
              <Input
                id="collectionDescription"
                value={newCollection.description}
                onChange={(e) => setNewCollection({...newCollection, description: e.target.value})}
                placeholder="e.g., Must-have gaming accessories"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCollection}>Create Collection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Collection Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          {editCollection && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editCollectionName">Collection Name</Label>
                <Input
                  id="editCollectionName"
                  value={editCollection.name}
                  onChange={(e) => setEditCollection({...editCollection, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCollectionDescription">Description</Label>
                <Input
                  id="editCollectionDescription"
                  value={editCollection.description}
                  onChange={(e) => setEditCollection({...editCollection, description: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCollection}>Update Collection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product to Collection Dialog */}
      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Product to Collection</DialogTitle>
            <DialogDescription>
              Add a product to "{selectedCollection?.name}" collection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productSelect">Select Product</Label>
              <select
                id="productSelect"
                className="w-full p-2 border border-slate-200 rounded-lg"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">Choose a product...</option>
                {products
                  .filter(p => !selectedCollection?.productIds.includes(p.id))
                  .map(product => (
                    <option key={product.id} value={product.id}>
                      {product.title} - {product.brand}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProductToCollection} disabled={!selectedProductId}>
              Add to Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectionsManager;