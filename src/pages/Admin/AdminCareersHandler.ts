import insforge from '../../lib/insforge';
import { Vacancy } from '../../types';

export const loadVacancies = async () => {
    try {
        const { data, error } = await insforge.database
            .from('vacancies')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as Vacancy[];
    } catch (err) {
        console.error('Vacancies Load Error:', err);
        throw err;
    }
};

export const saveVacancy = async (form: Omit<Vacancy, 'id' | 'created_at'>, editId: string | null) => {
    try {
        const payload = {
            ...form,
            updated_at: new Date().toISOString()
        };

        if (editId) {
            const { error } = await insforge.database
                .from('vacancies')
                .update(payload)
                .eq('id', editId);
            if (error) throw error;
        } else {
            const { error } = await insforge.database
                .from('vacancies')
                .insert([payload]);
            if (error) throw error;
        }
    } catch (err) {
        console.error('Vacancy Save Error:', err);
        throw err;
    }
};

export const deleteVacancy = async (id: string) => {
    try {
        const { error } = await insforge.database
            .from('vacancies')
            .delete()
            .eq('id', id);
        if (error) throw error;
    } catch (err) {
        console.error('Vacancy Delete Error:', err);
        throw err;
    }
};

export const toggleVacancyStatus = async (id: string, isActive: boolean) => {
    try {
        const { error } = await insforge.database
            .from('vacancies')
            .update({ is_active: isActive, updated_at: new Date().toISOString() })
            .eq('id', id);
        if (error) throw error;
    } catch (err) {
        console.error('Vacancy Toggle Error:', err);
        throw err;
    }
};

export const loadApplications = async () => {
    try {
        const { data, error } = await insforge.database
            .from('job_applications')
            .select('*, vacancies(position)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as any[];
    } catch (err) {
        console.error('Applications Load Error:', err);
        throw err;
    }
};

export const updateApplicationStatus = async (id: string, status: string) => {
    try {
        const { error } = await insforge.database
            .from('job_applications')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);
        if (error) throw error;
    } catch (err) {
        console.error('Application Status Update Error:', err);
        throw err;
    }
};
