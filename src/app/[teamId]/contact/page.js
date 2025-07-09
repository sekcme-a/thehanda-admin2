"use client";

import { useEffect } from "react";
import Header from "../components/Header";
import { useData } from "@/provider/DataProvider";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import { getYYYYMMDDHHMM } from "@/utils/getDate";
import { toYYYYMMDD_HHMM } from "@/utils/supabase/FormatTimeStamptz";

const PAGESIZE = 10;
const Contact = () => {
  const router = useRouter();
  const { teamId } = useParams();

  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [page]);
  const fetchData = async () => {
    setLoading(true);
    const from = (page - 1) * PAGESIZE;
    const to = from + PAGESIZE - 1;

    const { data, count, error } = await supabase
      .from("contact")
      .select(
        `
        *,
       profiles:profiles!contact_uid_fkey(display_name)`,
        { count: "exact" }
      )
      .eq("team_id", teamId)
      .order("created_at", { ascending: false })
      .range(from, to);
    console.log(error);
    console.log(data);
    setList(data);
    setCount(count);
    setLoading(false);
  };

  return (
    <>
      <Header title="문의 관리" />
      <div className="p-5">
        {list?.map((item, index) => {
          return (
            <div
              key={index}
              className="bg-white rounded-lg 
              px-3 py-2 cursor-pointer border-[1px] border-gray-200 mb-2
              hover:border-gray-400 hover:bg-gray-50 transition-all
              flex justify-between"
              onClick={() => router.push(`contact/${item.id}`)}
            >
              <div>
                <p className="font-bold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-600">
                  {toYYYYMMDD_HHMM(item.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-end">
                  {item.profiles?.display_name}
                </p>
                <p
                  className={`text-xs text-end ${
                    item.is_answered ? "text-blue-700" : "text-red-700"
                  }`}
                >
                  {item.is_answered ? "답변 완료" : "미답변"}
                </p>
              </div>
            </div>
          );
        })}
        <div className="mt-10 flex justify-center">
          <Pagination
            count={count ? Math.ceil(count / PAGESIZE) : 0}
            page={Number(page)}
            onChange={(event, page) => setPage(page)}
            variant="outlined"
            color="primary"
            showFirstButton
            showLastButton
            size="medium"
          />
        </div>
      </div>
    </>
  );
};

export default Contact;
