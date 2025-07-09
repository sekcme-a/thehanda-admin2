"use client";

import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { getYYYYMMDDHHMM } from "@/utils/getDate";
import { toYYYYMMDD_HHMM } from "@/utils/supabase/FormatTimeStamptz";
import { Button, TextField } from "@mui/material";
import { useNotification } from "@/provider/NotificationProvider";
import { useAuth } from "@/provider/AuthProvider";

const ContactDetail = () => {
  const { session, profile } = useAuth();
  const { contactId, teamId } = useParams();
  const { sendExpoSupabaseNotifications } = useNotification();
  const router = useRouter();
  const [data, setData] = useState({});

  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerProfile, setAnswerProfile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const { data } = await supabase
      .from("contact")
      .select(
        `
    *,
    profiles:profiles!contact_uid_fkey(display_name),
    answer_profile:profiles!contact_answer_uid_fkey(display_name)
  `
      )
      .eq("id", contactId)
      .single();

    if (!data) {
      alert("삭제되었거나 존재하지 않는 문의입니다.");
      router.back();
      return;
    }
    setData(data);
    if (data.answer) setAnswer(data.answer);
    if (data.answer_profile) setAnswerProfile(data.answer_profile);
  };

  const [sending, setSending] = useState(false);
  const handleSend = async () => {
    if (input === "") {
      alert("답변을 입력해주세요.");
      return;
    }
    setSending(true);

    try {
      const { error } = await supabase
        .from("contact")
        .update({
          answer: input,
          is_answered: true,
          answer_uid: session.user.id,
        })
        .eq("id", contactId);

      if (error) throw error;

      await sendExpoSupabaseNotifications(
        teamId,
        [{ userId: data.uid, displayName: data.profiles?.display_name }],
        {
          title: `문의하신 내용에 답변이 도착했어요!`,
          message: `[문의 내용]\n${data.title}\n${data.text}\n\n\n[답변]\n${input}`,
        },
        "program",
        {
          expoMessage: `프로필 > 마이페이지 > 내 알림에서 확인할 수 있어요.`,
          withoutUsingPoint: true,
          hideDialog: true,
        }
      );

      setInput("");
      setAnswer(input);
      console.log(profile);
      setAnswerProfile(profile);
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Header title="문의 관리" />
      <div className="p-5">
        <div className="p-3 bg-white rounded-lg border-[1px] border-gray-300">
          <h3 className="text-lg font-bold">{data.title}</h3>
          <h4 className="text-sm">작성자 : {data.profiles?.display_name}</h4>
          <p className="text-xs">{toYYYYMMDD_HHMM(data.created_at)}</p>
          <p className="mt-2 mb-10">{data.text}</p>

          {answer && (
            <>
              <p className="font-semibold text-sm">{`[작성한 답변]`}</p>
              <p className="text-xs text-gray-600">
                {`답변 작성자: ${answerProfile?.display_name ?? "알 수 없음"}`}
              </p>
              <p className=" text-gray-700 mb-10">{answer}</p>
            </>
          )}

          {/* <p className="font-bold mt-5">답변 작성</p> */}
          <p className="text-sm mb-2 text-gray-600">
            *답변을 다시 보낼 수는 있지만, 이전 답변 알림은 문의 작성자에게
            그대로 남아있어요.
          </p>
          <TextField
            className="mt-5"
            multiline
            rows={5}
            maxRows={10}
            fullWidth
            label="답변 작성"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            fullWidth
            sx={{ mt: 2 }}
            variant="contained"
            onClick={handleSend}
            disabled={sending}
          >
            답변 전송
          </Button>
        </div>
      </div>
    </>
  );
};

export default ContactDetail;
