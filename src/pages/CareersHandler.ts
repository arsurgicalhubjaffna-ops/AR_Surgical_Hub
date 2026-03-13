import insforge from '../lib/insforge';
import { JobApplication } from '../types';

export const submitApplication = async (application: Omit<JobApplication, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    try {
        const { data, error } = await insforge.database
            .from('job_applications')
            .insert([
                {
                    ...application,
                    status: 'pending',
                    updated_at: new Date().toISOString()
                }
            ]);
        
        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Application Submission Error:', err);
        throw err;
    }
};

export const uploadResume = async (file: File) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `resumes/${fileName}`;

        const { error: uploadError } = await insforge.storage
            .from('resumes')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const response = insforge.storage
            .from('resumes')
            .getPublicUrl(filePath);

        return typeof response === 'string' ? response : (response as any).data.publicUrl;
    } catch (err) {
        console.error('Resume Upload Error:', err);
        throw err;
    }
};
