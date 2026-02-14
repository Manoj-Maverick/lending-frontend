import { motion } from "framer-motion";
import Icon from "./AppIcon";

const floating = {
  animate: {
    y: [0, -30, 0],
    x: [0, 20, 0],
  },
  transition: {
    duration: 12,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const NoBranchAssigned = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* 🌈 Animated gradient base */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-warning/10"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* 🌊 Floating shapes */}
      <motion.div
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl"
        {...floating}
      />
      <motion.div
        className="absolute bottom-[-200px] right-[-200px] h-[600px] w-[600px] rounded-full bg-warning/20 blur-3xl"
        {...floating}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-accent/10 blur-2xl"
        {...floating}
      />

      {/* 🧠 Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-warning/20 backdrop-blur"
        >
          <Icon name="Building2" size={36} className="text-warning" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4"
        >
          No Branch Assigned
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="max-w-xl text-muted-foreground text-base md:text-lg leading-relaxed"
        >
          Your account is ready, but it hasn’t been connected to a branch yet.
          Once an administrator assigns a branch, your workspace will unlock
          automatically.
        </motion.p>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 flex items-center gap-3 text-sm text-muted-foreground"
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success" />
          </span>
          Waiting for administrator action…
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NoBranchAssigned;
