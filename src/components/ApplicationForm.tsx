"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function ApplicationForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        reason: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from("applications").insert([
                {
                    name: formData.name,
                    contact: formData.contact,
                    reason: formData.reason,
                },
            ]);

            if (error) throw error;
            setSuccess(true);
        } catch (error) {
            console.error("Error submitting:", error);
            alert("Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center p-10 bg-secondary/50 rounded-3xl border border-white/10">
                <h3 className="text-2xl font-bold mb-4">Application Received!</h3>
                <p className="text-muted-foreground">
                    We will review your application and get back to you shortly.
                </p>
            </div>
        );
    }

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="max-w-md mx-auto space-y-6"
        >
            <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-primary outline-none transition-colors"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Contact (Phone/Email)</label>
                <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-primary outline-none transition-colors"
                    placeholder="010-1234-5678"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Why do you need this?</label>
                <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-primary outline-none transition-colors resize-none"
                    placeholder="Briefly describe your goals..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
                {loading ? "Submitting..." : "Apply for Survival Package"}
            </button>

            <p className="text-xs text-center text-muted-foreground mt-4">
                * Only 5 spots available this month.
            </p>
        </motion.form>
    );
}
