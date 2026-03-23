import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-red-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />

      <div className="relative z-10 text-center px-6">
        {/* 403 animated */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-7xl font-extrabold tracking-widest text-red-500"
        >
          403
        </motion.h1>

        {/* subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-xl text-gray-300"
        >
          You don’t have permission to access this page
        </motion.p>

        {/* animated divider */}
        <motion.div
          className="h-[2px] w-32 bg-red-500 mx-auto mt-6"
          initial={{ width: 0 }}
          animate={{ width: "8rem" }}
          transition={{ delay: 0.6 }}
        />

        {/* button */}
        <motion.button
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold shadow-lg"
        >
          Go to Dashboard
        </motion.button>

        {/* subtle floating text */}
        <motion.div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm text-gray-500"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          🔒 Restricted Access
        </motion.div>
      </div>
    </div>
  );
}
