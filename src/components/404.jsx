import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const PageNotFound = () => {
    const [showElements, setShowElements] = useState(false);

    useEffect(() => {
        setShowElements(true);
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 10
            }
        }
    };

    const floatingVariants = {
        float: {
            y: [-10, 10],
            transition: {
                y: {
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut'
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <motion.div
                initial="hidden"
                animate={showElements ? "visible" : "hidden"}
                variants={containerVariants}
                className="max-w-2xl w-full"
            >
                {/* Animated 404 number */}
                <motion.div
                    variants={itemVariants}
                    className="relative mb-8"
                >
                    <motion.div
                        variants={floatingVariants}
                        animate="float"
                        className="absolute -left-20 -top-20 w-40 h-40 bg-amber-400/10 rounded-full blur-xl"
                    />
                    <motion.div
                        variants={floatingVariants}
                        animate="float"
                        className="absolute -right-20 -bottom-20 w-40 h-40 bg-emerald-400/10 rounded-full blur-xl"
                    />
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent relative z-10">
                        404
                    </h1>
                </motion.div>

                {/* Title */}
                <motion.h2
                    variants={itemVariants}
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                >
                    Oops! Page Not Found
                </motion.h2>

                {/* Description */}
                <motion.p
                    variants={itemVariants}
                    className="text-gray-400 text-lg mb-8 max-w-md mx-auto"
                >
                    The page you're looking for doesn't exist or has been moved.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row justify-center gap-4"
                >
                    <Link
                        to="/"
                        className="flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
                    >
                        <Home className="h-5 w-5 mr-2" />
                        Back to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center px-6 py-3 border border-gray-700 hover:border-amber-400 text-amber-400 hover:text-white rounded-lg font-medium transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Go Back
                    </button>
                </motion.div>

                {/* Floating decorative elements */}
                <motion.div
                    variants={floatingVariants}
                    animate="float"
                    className="absolute left-1/4 top-1/3 w-8 h-8 bg-amber-400/20 rounded-full blur-sm"
                />
                <motion.div
                    variants={floatingVariants}
                    animate="float"
                    className="absolute right-1/4 bottom-1/4 w-6 h-6 bg-emerald-400/20 rounded-full blur-sm"
                />
            </motion.div>
        </div>
    );
};

export default PageNotFound;