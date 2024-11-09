import { FaExclamationTriangle } from "react-icons/fa";

interface FormErrorProps {
    message: string;
}

export default function FormError({ message }: FormErrorProps) {
    if (!message) return null;
    return (
        <div className="flex items-center space-x-2 text-red-500 bg-red-100 p-2 rounded">
            <FaExclamationTriangle />
            <span>{message}</span>
        </div>
    );
}
