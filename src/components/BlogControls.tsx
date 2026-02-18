"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BlogControls({ postId }: { postId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const password = prompt("비밀번호를 입력하세요 (관리자 확인용):");
        if (password !== "nadoo1234") {
            alert("비밀번호가 틀렸습니다.");
            return;
        }

        if (!confirm("정말로 이 글을 삭제하시겠습니까?")) return;

        setIsDeleting(true);
        const { error } = await supabase.from("posts").delete().eq("id", postId);

        if (error) {
            alert("삭제 중 오류가 발생했습니다: " + error.message);
            setIsDeleting(false);
        } else {
            alert("삭제되었습니다.");
            router.push("/blog");
            router.refresh();
        }
    };

    const handleEdit = () => {
        const password = prompt("비밀번호를 입력하세요 (관리자 확인용):");
        if (password !== "nadoo1234") {
            alert("비밀번호가 틀렸습니다.");
            return;
        }
        router.push(`/edit/${postId}`);
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleEdit}
                className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors"
                disabled={isDeleting}
            >
                수정
            </button>
            <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors"
                disabled={isDeleting}
            >
                {isDeleting ? "삭제 중..." : "삭제"}
            </button>
        </div>
    );
}
