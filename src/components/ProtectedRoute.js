import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // حالة لتخزين حالة تسجيل الدخول

        let {userToken} = useContext(AuthContext)
    

    useEffect(() => {
            if (userToken) {
                setIsAuthenticated(true); // المستخدم مسجل
            } else {
                setIsAuthenticated(false); // المستخدم غير مسجل
            }

    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // يمكنك عرض شاشة تحميل أثناء انتظار حالة المصادقة
    }

    if (isAuthenticated) {
        return children; // إذا كان المستخدم مسجلاً، ارجع المحتوى
    } else {
        return <Navigate to="/login" />; // إذا لم يكن مسجلاً، توجيه إلى صفحة تسجيل الدخول
    }
}

export default ProtectedRoute