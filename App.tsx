
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { Controls } from './components/Controls';
import { EquipmentTable } from './components/EquipmentTable';
import { EquipmentModal } from './components/EquipmentModal';
import { ToastContainer } from './components/ToastContainer';
import { Pagination } from './components/Pagination';
import { equipmentService } from './services/equipmentService';
import { useDebounce } from './hooks/useDebounce';
import { Equipment, ToastMessage } from './types';

const ITEMS_PER_PAGE = 12;

const App: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [sheets, setSheets] = useState<string[]>(['Overall']);
  const [currentSheet, setCurrentSheet] = useState<string>('Overall');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useState<{ isOpen: boolean; data: Equipment | null }>({ isOpen: false, data: null });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const loadSheets = useCallback(async () => {
    try {
      const availableSheets = await equipmentService.getSheets();
      setSheets(availableSheets);
    } catch (error) {
      console.error('Failed to load sheets:', error);
      addToast('Could not load categories.', 'error');
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setSelectedItems([]); // Clear selection on load
    try {
      const data = await equipmentService.getAllEquipment(currentSheet);
      setEquipmentList(data);
      addToast(`Loaded ${data.length} items from ${currentSheet}`, 'success');
    } catch (error) {
      console.error('Failed to load equipment data:', error);
      addToast(`Failed to load data from ${currentSheet}.`, 'error');
      setEquipmentList([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentSheet]);

  useEffect(() => {
    loadSheets();
  }, [loadSheets]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const handleRefresh = () => {
    setSearchQuery('');
    setCurrentPage(1);
    loadData();
  }

  const handleOpenModal = (data: Equipment | null = null) => {
    setModalState({ isOpen: true, data });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, data: null });
  };

  const handleSave = async (data: Equipment) => {
    const isEditing = !!modalState.data;
    try {
      await equipmentService.saveEquipment(data, currentSheet, isEditing);
      addToast(`Equipment ${isEditing ? 'updated' : 'added'} successfully.`, 'success');
      handleCloseModal();
      loadData(); // Refresh data after saving
    } catch (error) {
      console.error('Failed to save equipment:', error);
      addToast('Failed to save equipment.', 'error');
    }
  };

  const handleDelete = async (siNo: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await equipmentService.deleteEquipment(siNo, currentSheet);
        addToast('Equipment deleted successfully.', 'success');
        setSelectedItems(prev => prev.filter(id => id !== siNo));
        loadData(); // Refresh data after deleting
      } catch (error) {
        console.error('Failed to delete equipment:', error);
        addToast('Failed to delete equipment.', 'error');
      }
    }
  };

  const filteredEquipment = useMemo(() => {
    if (!debouncedSearchQuery) {
      return equipmentList;
    }
    const lowercasedQuery = debouncedSearchQuery.toLowerCase();
    return equipmentList.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(lowercasedQuery)
      )
    );
  }, [equipmentList, debouncedSearchQuery]);

  const paginatedEquipment = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEquipment.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEquipment, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredEquipment.length / ITEMS_PER_PAGE);
  }, [filteredEquipment]);

  const handleSelectItem = (siNo: number, isSelected: boolean) => {
    setSelectedItems(prev => 
      isSelected ? [...prev, siNo] : prev.filter(id => id !== siNo)
    );
  };

  const handleSelectAll = (isSelected: boolean) => {
    const currentPageIds = paginatedEquipment.map(item => item['SI No']);
    if (isSelected) {
      // Add current page items to selection, avoiding duplicates
      setSelectedItems(prev => [...new Set([...prev, ...currentPageIds])]);
    } else {
      // Remove current page items from selection
      setSelectedItems(prev => prev.filter(id => !currentPageIds.includes(id)));
    }
  };

  const handleSheetChange = (sheet: string) => {
    setCurrentSheet(sheet);
    setSelectedItems([]);
    setCurrentPage(1);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected items?`)) {
      try {
        addToast(`Deleting ${selectedItems.length} items...`, 'success');
        await Promise.all(selectedItems.map(siNo => equipmentService.deleteEquipment(siNo, currentSheet)));
        addToast(`${selectedItems.length} items deleted successfully.`, 'success');
        loadData();
      } catch (error) {
        console.error('Failed to bulk delete:', error);
        addToast('Failed to delete selected items.', 'error');
      }
    }
  };

  const handleBulkUpdateStatus = async (field: 'Own' | 'Rental', value: '✓' | '-') => {
    if (window.confirm(`Are you sure you want to update ${selectedItems.length} selected items?`)) {
      try {
        const itemsToUpdate = equipmentList.filter(item => selectedItems.includes(item['SI No']));
        addToast(`Updating ${itemsToUpdate.length} items...`, 'success');
        await Promise.all(itemsToUpdate.map(item => {
          const updatedItem = { ...item, [field]: value };
          if (field === 'Own' && value === '✓') updatedItem['Rental'] = '-';
          if (field === 'Rental' && value === '✓') updatedItem['Own'] = '-';
          return equipmentService.saveEquipment(updatedItem, currentSheet, true);
        }));
        addToast(`${itemsToUpdate.length} items updated successfully.`, 'success');
        loadData();
      } catch (error) {
        console.error('Failed to bulk update:', error);
        addToast('Failed to update selected items.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Header onRefresh={handleRefresh} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Stats data={equipmentList} />
        <Controls
          sheets={sheets}
          currentSheet={currentSheet}
          onSheetChange={handleSheetChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdd={() => handleOpenModal(null)}
          onRefresh={handleRefresh}
          selectedCount={selectedItems.length}
          onClearSelection={() => setSelectedItems([])}
          onBulkDelete={handleBulkDelete}
          onBulkUpdateStatus={handleBulkUpdateStatus}
        />
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <EquipmentTable
            data={paginatedEquipment}
            isLoading={isLoading}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
          />
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>
      {modalState.isOpen && (
        <EquipmentModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          editingItem={modalState.data}
        />
      )}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
