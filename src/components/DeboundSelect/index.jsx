import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Select, Spin } from "antd";
import debounce from "lodash/debounce";
import React, { useMemo, useRef, useState } from "react";

export function DebounceSelect({
  fetchOptions,
  debounceTimeout = 800,
  childrenRight = null,
  refreshData = false,
  selectId = null,
  ...props
}) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
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
  }, [debounceFetcher, refreshData]);

  return (
    <Flex gap={10}>
      <Select
        id={selectId}
        showSearch
        // labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
        options={options}
      />
      {childrenRight}
    </Flex>
  );
}
