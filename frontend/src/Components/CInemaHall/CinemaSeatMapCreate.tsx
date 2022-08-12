
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";

import { type } from "os";
import React, { useState } from "react";
import CinemaColumn from "./CinemaColumn";
import CinemaPadding from "./CinemaPadding";
import Seat from "./CinemaSeat/Seat";
import { CinemaHallColumn } from "./types";
const { Text, Link, Title } = Typography;
const CinemaSeatMapCreate = ({seatMap,setSeatMap}:{seatMap:CinemaHallColumn[],setSeatMap:React.Dispatch<React.SetStateAction<CinemaHallColumn[]>>}) => {
  const [columnAdd, setColumnAdd] = useState<{
    columnName: number;
    numberOfRows: number;
    columnType: "PADDING" | "SEATMAP";
  }>({ columnName: 1, numberOfRows: 1, columnType: "SEATMAP" });

  function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  let keys = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
  ];
  const removeColumn = (columnName: string) => {
    // Remove the said element then recalculate column order
    setSeatMap(
      seatMap
        .filter((e) => e.columnName != columnName)
        .map((e, i) => {
          e.columnOrder = i;
          return e;
        })
        .sort((a, b) => a.columnOrder - b.columnOrder)
    );
  };
  return (
    <div>
      <Row align="bottom">
        {seatMap.map((e) => {
          if (e.columnType == "SEATMAP") {
            return (
              <CinemaColumn
                key={e.columnName}
                column={e}
                onRemoveColumn={removeColumn}
              />
            );
          } else if (e.columnType == "PADDING") {
            return (
              <CinemaPadding
                key={e.columnName}
                seatMap={seatMap}
                column={e}
                onRemoveColumn={removeColumn}
              />
            );
          }
        })}
      </Row>
      <Row style={{ paddingTop: "10px" }} justify="center">
        <Popconfirm
          icon={<PlusOutlined style={{ color: "blue" }} />}
          title={
            <>
              <Space direction="vertical">
                <Row>Column Number</Row>
                <Row>
                  <InputNumber
                    min={0}
                    value={columnAdd.columnName}
                    onChange={(val) => {
                      if (!val) return;
                      setColumnAdd({
                        columnName: parseInt(val.toString()),
                        numberOfRows: columnAdd.numberOfRows,
                        columnType: columnAdd.columnType,
                      });
                    }}
                    style={{ width: 100 }}
                  />
                </Row>
                {columnAdd.columnType == "SEATMAP" ? (
                  <>
                    <Row>Number Of Rows</Row>
                    <Row>
                      <InputNumber
                        min={1}
                        max={17}
                        value={columnAdd.numberOfRows}
                        onChange={(val) => {
                          if (!val) return;
                          setColumnAdd({
                            numberOfRows: parseInt(val.toString()),
                            columnName: columnAdd.columnName,
                            columnType: columnAdd.columnType,
                          });
                        }}
                        style={{ width: 100 }}
                      />
                    </Row>
                  </>
                ) : null}

                <Row>Column Type</Row>
                <Row>
                  <Select
                    defaultValue={columnAdd.columnType}
                    style={{ width: 100 }}
                    onChange={(value) => {
                      if (!value) return;
                      if (value == "PADDING") {
                        return setColumnAdd({
                          numberOfRows: 0,
                          columnName: getRandomIntInclusive(200, 900),
                          columnType: value,
                        });
                      }
                      return setColumnAdd({
                        //! Reset the values
                        numberOfRows: 1,
                        columnName: 1,
                        columnType: value,
                      });
                    }}
                  >
                    <Select.Option value="SEATMAP">SeatMap</Select.Option>
                    <Select.Option value="PADDING">Padding</Select.Option>
                  </Select>
                </Row>
              </Space>
            </>
          }
          onConfirm={() => {
            if (
              seatMap.findIndex(
                (e) => e.columnName === columnAdd.columnName.toString()
              ) != -1
            ) {
              message.error(
                "Column name already in use, please remove the existing column first if you want to add it again!"
              );
              return;
            }
            setSeatMap([
              ...seatMap,
              {
                columnName: columnAdd.columnName.toString(),
                columnOrder: seatMap.length,
                columnType: columnAdd.columnType,
                seats: [...Array(columnAdd.numberOfRows)]
                  .map((j, i) => {
                    return {
                      seatName: `${keys[i]}${columnAdd.columnName}`,
                    };
                  })
                  .reverse(),
              },
            ]);
          }}
        >
          <Tooltip placement="bottom" title="Add a column">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {}}
            ></Button>
          </Tooltip>
        </Popconfirm>
      </Row>
    </div>
  );
};

export default CinemaSeatMapCreate;
