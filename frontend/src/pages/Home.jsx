export default function Home() {
  return (
    <main 
      role="main"
      style={{
        backgroundImage: 'url(/modern-bg.jpg)', // Replace with your image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
        padding: '40px 20px'
      }}
    >
      {/* Overlay for better text readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1
      }}></div>
      
      {/* Get Started Button at Bottom */}
      <button
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#2c3e50',
          border: 'none',
          padding: '15px 40px',
          fontSize: '1.2rem',
          borderRadius: '30px',
          cursor: 'pointer',
          fontWeight: '600',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
          zIndex: 2,
          position: 'relative'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
          e.target.style.transform = 'translateY(-3px)';
          e.target.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
        }}
      >
        Get Started
      </button>
    </main>
  );
}