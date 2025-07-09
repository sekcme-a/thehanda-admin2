import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  Input,
  InputAdornment,
} from "@mui/material";
import { CSVLink } from "react-csv";

import ImportExportIcon from "@mui/icons-material/ImportExport";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import styles from "./CSVTable.module.css";

/**
 * CSVTable 컴포넌트
 *
 * @param {string} title - CSV 파일명
 * @param {Array} headers - [{ key, label }]
 * @param {Array} data - [{ id, key1, key2, ... }]
 * @param {function} onItemClick - 각 항목 클릭시 콜백
 * @param {boolean} hasCheck - 체크박스 표시 여부
 * @param {Array} checkedList - 선택된 id 리스트
 * @param {function} setCheckedList - 선택 리스트 갱신 함수
 */
const CSVTable = ({
  title,
  headers,
  data,
  onItemClick,
  hasCheck,
  checkedList,
  setCheckedList,
}) => {
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleCheckAll = (e) => {
    const checked = e.target.checked;
    setCheckedList(checked ? data.map((item) => item.id) : []);
    setIsAllChecked(checked);
  };

  const handleCheckItem = (e, itemId) => {
    const checked = e.target.checked;
    setCheckedList((prev) =>
      checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)
    );
    if (!checked) setIsAllChecked(false);
  };

  const handleSearch = (value) => {
    setSearchInput(value);
    if (!value.trim()) {
      setFilteredData(data);
      return;
    }

    const lowerValue = value.toLowerCase();
    const results = data.filter((item) =>
      Object.values(item).some((v) =>
        v?.toString().toLowerCase().includes(lowerValue)
      )
    );
    setFilteredData(results);
  };

  return (
    <div className={styles.root_container}>
      <div className={styles.remote_container}>
        <FormControl sx={{ m: 1 }}>
          <Input
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            }
          />
        </FormControl>

        <Button
          variant="contained"
          size="small"
          sx={{ ml: 2, backgroundColor: "rgb(0, 98, 196)" }}
        >
          <ImportExportIcon sx={{ fontSize: 20, mr: 0.5 }} />
          <CSVLink
            headers={headers}
            data={filteredData}
            filename={`${title}.csv`}
            target="_blank"
            style={{ color: "white", textDecoration: "none" }}
          >
            엑셀로 추출
          </CSVLink>
        </Button>
      </div>

      <div className={styles.main_container} style={{ marginTop: 10 }}>
        <table>
          <thead>
            <tr>
              {hasCheck && (
                <th className={styles.check}>
                  <Checkbox checked={isAllChecked} onChange={handleCheckAll} />
                </th>
              )}
              {headers.map(({ label }, idx) => (
                <th key={idx} className={styles.header_item}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                {hasCheck && (
                  <td className={styles.check}>
                    <Checkbox
                      checked={checkedList.includes(item.id)}
                      onChange={(e) => handleCheckItem(e, item.id)}
                      disabled={item.deleted}
                    />
                  </td>
                )}
                {headers.map(({ key }, i) => (
                  <td key={i} onClick={() => onItemClick(item)}>
                    {typeof item[key] === "string" ||
                    typeof item[key] === "number"
                      ? item[key]?.toString().length > 30
                        ? item[key].toString().slice(0, 30) + "..."
                        : item[key]
                      : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CSVTable;
