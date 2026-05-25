import './style.css';

export const PageLoader = () => (
  <div className="page-loader">
    <div className="loader-spinner" />
    <p>Loading...</p>
  </div>
);

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-image skeleton-shimmer" />
    <div className="skeleton-body">
      <div className="skeleton-line skeleton-shimmer" style={{ width: '40%', height: '12px' }} />
      <div className="skeleton-line skeleton-shimmer" style={{ width: '80%', height: '16px' }} />
      <div className="skeleton-line skeleton-shimmer" style={{ width: '100%', height: '12px' }} />
      <div className="skeleton-line skeleton-shimmer" style={{ width: '60%', height: '12px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <div className="skeleton-line skeleton-shimmer" style={{ width: '30%', height: '20px' }} />
        <div className="skeleton-line skeleton-shimmer" style={{ width: '25%', height: '34px', borderRadius: '20px' }} />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export default PageLoader;
