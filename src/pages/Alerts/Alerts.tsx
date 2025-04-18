import { useState, useEffect } from 'react';
import { FaPlus, FaTable, FaTh, FaSearch, FaSort, FaSync, FaBell } from 'react-icons/fa';
import Button from '../../components/UI/Button';
import { useAlertStore } from '../../stores/alertStore';
import { Alert } from '../../types/alert';
import { AlertForm, AlertCardView, AlertsTable } from './components';
import styles from './Alerts.module.scss';
import Loader from '../../components/Loader/Loader';
import ConfirmationModal from './components/ConfirmationModal';
import Card from '../../components/UI/Card/Card';

type ViewMode = 'cards' | 'table';

const Alerts = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table'); // Default to table view with new theme
  const [selectedAlert, setSelectedAlert] = useState<Alert | undefined>(undefined);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    alertId: '',
    alertName: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByTriggered, setSortByTriggered] = useState<'asc' | 'desc' | null>(null);
  
  // Use the alert store instead of direct service calls
  const { 
    alertStatuses,
    isLoadingStatuses,
    fetchAlertStatuses,
    fetchAlertById,
    selectedAlert: storeSelectedAlert,
    clearSelectedAlert,
    deleteAlert
  } = useAlertStore();

  // Fetch alert statuses on mount and set up refresh interval
  useEffect(() => {
    fetchAlertStatuses();
    
    // Set up an interval to refresh data every 10 minutes
    const intervalId = setInterval(() => {
      fetchAlertStatuses();
    }, 600000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [fetchAlertStatuses]);

  // Update local selectedAlert when store's selectedAlert changes
  useEffect(() => {
    if (storeSelectedAlert) {
      setSelectedAlert(storeSelectedAlert);
    }
  }, [storeSelectedAlert]);

  // Filter and sort alerts
  const filteredAndSortedAlerts = alertStatuses
    .filter(alert => 
      searchQuery === '' || 
      alert.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortByTriggered === 'asc') {
        return Number(a.isTriggered) - Number(b.isTriggered);
      } else if (sortByTriggered === 'desc') {
        return Number(b.isTriggered) - Number(a.isTriggered);
      }
      return 0;
    });

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedAlert(undefined);
    clearSelectedAlert(); // Clear the selected alert in the store as well
  };

  const handleEditAlert = async (alertId: string) => {
    await fetchAlertById(alertId);
    setShowForm(true);
  };

  const handleDeleteAlert = async (alertId: string) => {
    const alert = alertStatuses.find(a => a.id === alertId);
    if (alert) {
      setDeleteConfirmation({
        isOpen: true,
        alertId: alertId,
        alertName: alert.name
      });
    }
  };

  const confirmDelete = async () => {
    await deleteAlert(deleteConfirmation.alertId);
    await fetchAlertStatuses();
    closeDeleteConfirmation();
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      alertId: '',
      alertName: ''
    });
  };

  const handleCreateNew = () => {
    // Ensure we clear any selected alert first
    setSelectedAlert(undefined);
    clearSelectedAlert();
    setShowForm(true);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'cards' ? 'table' : 'cards');
  };

  const toggleSortByTriggered = () => {
    if (sortByTriggered === null) {
      setSortByTriggered('desc');
    } else if (sortByTriggered === 'desc') {
      setSortByTriggered('asc');
    } else {
      setSortByTriggered(null);
    }
  };
  
  const handleRefresh = () => {
    fetchAlertStatuses();
  };
  
  const renderEmptyState = () => {
    return (
      <Card className={styles.emptyStateCard} glowEffect="blue" hoverable={false}>
        <div className={styles.emptyStateIcon}>
          <FaBell size={48} color="var(--accent-blue)" />
        </div>
        <h3>No Alerts Found</h3>
        <p>
          You haven't created any weather alerts yet. Create your first alert to get notified 
          when specific weather conditions occur in your monitored locations.
        </p>
        <Button 
          onClick={handleCreateNew} 
          variant="primary"
          size="lg"
        >
          <FaPlus style={{ marginRight: '0.5rem' }} />
          Create Your First Alert
        </Button>
      </Card>
    );
  };
  
  const renderContent = () => {
    if (isLoadingStatuses) {
      return <Loader text="Loading alerts..." />;
    }

    // First check if there are no alerts at all
    if (alertStatuses.length === 0) {
      return renderEmptyState();
    }

    // Display the appropriate view, even if filteredAndSortedAlerts is empty due to search
    return viewMode === 'cards' 
      ? (
        <AlertCardView 
          alerts={filteredAndSortedAlerts}
          onEdit={handleEditAlert}
          onDelete={handleDeleteAlert}
        />
      ) : (
        <AlertsTable 
          alerts={filteredAndSortedAlerts}
          onEdit={handleEditAlert}
          onDelete={handleDeleteAlert}
          onCreateNew={handleCreateNew}
          loading={isLoadingStatuses}
        />
      );
  };

  return (
    <div className={styles.alertsPage}>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Weather Alerts</h1>
          <div className={styles.headerActions}>
            <div className={styles.filterContainer}>
              <div className={styles.searchContainer}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search alerts by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  aria-label="Search alerts"
                />
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={toggleSortByTriggered}
                className={`${styles.sortButton} ${sortByTriggered ? styles.active : ''}`}
                aria-label="Toggle sort order"
              >
                <FaSort style={{ marginRight: '0.5rem' }} />
                {sortByTriggered === 'desc' ? 'Triggered First' : 
                 sortByTriggered === 'asc' ? 'Not Triggered First' : 'Sort by Status'}
              </Button>
            </div>
            <Button 
              variant="outline"
              onClick={toggleViewMode}
              className={styles.viewToggleBtn}
            >
              {viewMode === 'cards' ? <FaTable style={{ marginRight: '0.5rem' }} /> : <FaTh style={{ marginRight: '0.5rem' }} />}
              {viewMode === 'cards' ? 'Table View' : 'Card View'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              title="Refresh alerts data"
            >
              <FaSync style={{ marginRight: '0.5rem' }} />
              Refresh
            </Button>
            <Button 
              onClick={handleCreateNew} 
              variant="primary"
            >
              <FaPlus style={{ marginRight: '0.5rem' }} />
              Create Alert
            </Button>
          </div>
        </div>
        {renderContent()}
      </div>

      {/* Alert Form Modal */}
      <AlertForm 
        isOpen={showForm}
        onClose={handleFormClose}
        onSuccess={fetchAlertStatuses}
        alert={selectedAlert}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        title="Delete Alert"
        message={`Are you sure you want to delete "${deleteConfirmation.alertName}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={confirmDelete}
        onCancel={closeDeleteConfirmation}
      />
    </div>
  );
};

export default Alerts; 