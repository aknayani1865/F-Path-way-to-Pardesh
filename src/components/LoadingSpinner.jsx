import { motion } from "framer-motion";
import { FaPlane } from "react-icons/fa"; // Importing an airplane icon

const LoadingSpinner = () => {
	return (
		<div className="min-h-screen flex items-center justify-center relative overflow-hidden">
			{/* Loading Spinner with Airplane Icon */}
			<motion.div
				className="flex flex-col items-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<motion.div
					className="text-gray-800 text-6xl" // You can adjust the color here if needed
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
				>
					<FaPlane />
				</motion.div>
				<motion.p
					className="text-gray-800 text-lg mt-4" // You can adjust the color here if needed
					initial={{ y: -20 }}
					animate={{ y: 0 }}
					transition={{ duration: 0.5, delay: 0.5 }}
				>
					Loading your travel experience...
				</motion.p>
			</motion.div>
		</div>
	);
};

export default LoadingSpinner;