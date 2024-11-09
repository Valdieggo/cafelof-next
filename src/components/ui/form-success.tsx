import { FaCheckCircle } from "react-icons/fa";

interface FormSuccessProps {
    message: string;
}

export default function FormSuccess({ message }: FormSuccessProps) {
    if(!message) return null;
    return (
        <div className="flex items-center space-x-2 text-green-500 bg-green-100 p-2 rounded">
            <FaCheckCircle />
            <span>{message}</span>
        </div>
    );
}
