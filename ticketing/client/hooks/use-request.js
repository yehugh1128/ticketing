import axios from "axios";
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const displayError = (field='') => {
        const display = field ? (errors && errors.find(err => err.field === field)) || null : errors && errors[0];
        if (display) {
            return <div className='alert alert-danger'>{display.message}</div>
        }
    }
    const doRequest = async (props = {}) => {
        try {
            const response = await axios[method](url, {...body, ...props} || {});
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        }
        catch (err) {
            setErrors(err.response.data.errors);
        }
    }

    return { doRequest, displayError };
}

export default useRequest;