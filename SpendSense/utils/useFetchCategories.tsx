import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import supabase from '@/supabase/supabase';

export const useFetchCategories = () => {
    const { userID, refreshUserData, setRefreshUserData, categories, setCategories } = useUser();

    useEffect(() => {
        const fetchCategories = async () => {
            let { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('user_id', userID);
            if (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            } else if (data) {
                setCategories(data);
                setRefreshUserData(false);
            }
        };
        fetchCategories();
    }, [userID, refreshUserData]);

    return { categories, setCategories, setRefreshUserData };
};
