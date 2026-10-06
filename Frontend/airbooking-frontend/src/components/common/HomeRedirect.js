const HomeRedirect = () => {
  const { isAdmin, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  console.log('=== HomeRedirect Debug ===');
  console.log('User object:', user);
  console.log('isAdmin value:', isAdmin);
  console.log('User role fields:', {
    is_staff: user?.is_staff,
    is_superuser: user?.is_superuser,
    role: user?.role,
    user_type: user?.user_type,
    is_admin: user?.is_admin
  });

  // Redirect admin users to admin dashboard, regular users to user dashboard
  if (isAdmin) {
    console.log('Redirecting ADMIN to /admin');
    return <Navigate to="/admin" replace />;
  } else {
    console.log('Redirecting REGULAR USER to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }
};

// ... rest of App component remains the same ...