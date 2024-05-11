import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Select, Spin } from "antd";
import debounce from "lodash/debounce";
import React, { useMemo, useRef, useState } from "react";

function DebounceSelectMemo({
  fetchOptions = () => {},
  debounceTimeout = 800,
  childrenRight = null,
  refreshData = false,
  selectId = null,
  initValue,
  onChange,
  allowClear = false,
  onSelected,
  ...props
}) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([
    {
      value: initValue,
      label: "Đang tải",
    },
  ]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value)
        .then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return;
          }

          setOptions(newOptions);
          setFetching(false);
        })
        .catch((err) => {
          setFetching(false);
        });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  React.useEffect(() => {
    debounceFetcher();
  }, [refreshData]);

  const handleChange = (value) => {
    if (onChange) {
      const selected = options.find((option) => option.value === value);
      if (selected) {
        console.log(selected);
        onChange(selected);
      }
    }
  };

  return (
    <Flex gap={10}>
      <Select
        allowClear={allowClear}
        onClear={() => {
          setOptions([]);
          onChange("");
          debounceFetcher("");
        }}
        id={selectId}
        showSearch
        filterOption={false}
        loading={fetching}
        onChange={handleChange}
        onSearch={debounceFetcher}
        onSelect={onSelected}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
        options={options}
      />
      {childrenRight}
    </Flex>
  );
}

export const DebounceSelect = React.memo(DebounceSelectMemo);
