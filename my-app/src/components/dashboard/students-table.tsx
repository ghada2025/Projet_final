"use client";

import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/dashboard/alert-dialog";
import { Button } from "@/components/dashboard/button";
import { Checkbox } from "@/components/dashboard/checkbox";
import { Progress } from "@/components/dashboard/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dashboard/dropdown-menu";
import { Input } from "@/components/dashboard/input";
import { Label } from "@/components/dashboard/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/dashboard/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/dashboard/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/table";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiErrorWarningLine,
  RiCloseCircleLine,
  RiDeleteBinLine,
  RiBardLine,
  RiFilter3Line,
  RiSearch2Line,
  RiVerifiedBadgeFill,
  RiCheckLine,
  RiMoreLine,
  RiAddLine,
} from "@remixicon/react";
import {
  ChangeEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/dashboard/tooltip";

type Item = {
  id: string;
  name: string;
  class: string;
  email: string;
  verified: boolean;
  value: number;
  joinDate: string;
};

const statusFilterFn: FilterFn<Item> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

type GetColumnsProps = {
  data: Item[];
  setData: React.Dispatch<React.SetStateAction<Item[]>>;
  isOpen?: boolean;
  isAssign?: boolean;
};

export const getColumns = ({
  data,
  setData,
  isOpen,
  isAssign,
}: GetColumnsProps): ColumnDef<Item>[] => [
  // Select Column (only if !isAssign)
  ...(!isAssign
    ? [
        {
          id: "select",
          header: ({ table }: { table: any }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          ),
          cell: ({ row }: { row: any }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          size: 28,
          enableSorting: false,
          enableHiding: false,
        },
      ]
    : []),

  // Name Column
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="font-medium block w-full truncate">
          {row.getValue("name")}
        </div>
      </div>
    ),
    size: 180,
    enableHiding: false,
  },

  // ID Column
  {
    header: "ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <span className="text-muted-foreground block w-full truncate">
        {row.getValue("id")}
      </span>
    ),
    size: 110,
  },

  // Class Column
  {
    header: "Class",
    accessorKey: "class",
    cell: ({ row }) => (
      <div className="flex items-center h-full">
        <p className="bg-blue-500 text-white font-medium rounded px-4 py-1">
          {row.getValue("class")}
        </p>
      </div>
    ),
    size: 110,
    filterFn: statusFilterFn,
  },

  // Email Column
  {
    header: "Email",
    accessorKey: "email",
    cell: ({ row }) => (
      <span
        className="text-muted-foreground block w-full truncate cursor-pointer"
        onClick={() => copyToClipboard(row.getValue("email"))}
      >
        {row.getValue("email")}
      </span>
    ),
    size: 140,
  },

  // Verified Column
  {
    header: "Verified",
    accessorKey: "verified",
    cell: ({ row }) => (
      <div>
        <span className="sr-only">
          {row.original.verified ? "Verified" : "Not Verified"}
        </span>
        <RiVerifiedBadgeFill
          size={20}
          className={cn(
            row.original.verified ? "fill-blue-600" : "fill-muted-foreground/50"
          )}
          aria-hidden="true"
        />
      </div>
    ),
    size: 90,
  },

  // Answer or Progress Column
  ...(!isOpen
    ? isAssign
      ? [
          {
            header: "Answer",
            accessorKey: "answer",
            cell: ({ row }: any) => {
              return (
                <button
                  onClick={() => {
                    window.open(
                      row.getValue("answer"),
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  className="px-4 py-1 bg-blue-500 text-white rounded-sm hover:bg-blue-600"
                >
                  Open
                </button>
              );
            },
          },
        ]
      : [
          {
            header: "Progress",
            accessorKey: "value",
            cell: ({ row }: any) => {
              const value = row.getValue("value") as number;
              return (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex h-full w-full items-center">
                        <Progress className="h-1" value={value} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent align="start" sideOffset={-8}>
                      <p>{value}%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            },
            size: 80,
          },
        ]
    : []),

  // Actions Column
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <RowActions setData={setData} data={data} item={row.original} />
    ),
    size: 60,
    enableHiding: false,
  },
];

// Copy to Clipboard Function
const copyToClipboard = (text: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Clipboard write failed", err);
    });
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback: Copy failed", err);
    }
    document.body.removeChild(textArea);
  }
};

export default function StudentsTable({
  isOpen,
  isAssign,
  assignments,
}: {
  isOpen?: boolean;
  isAssign?: boolean;
  assignments?: any;
}) {
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<string[]>([]);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "name",
      desc: false,
    },
  ]);

  const [data, setData] = useState<Item[]>([]);
  if (isAssign) {
    useEffect(() => {
      setData(assignments);
      setIsLoading(false);
    }, [assignments]);
  }
  const [isLoading, setIsLoading] = useState(true);

  const columns = useMemo(
    () => getColumns({ data, setData, isOpen, isAssign }),
    [data]
  );

  if (!isAssign) {
    useEffect(() => {
      async function fetchPosts() {
        try {
          const res = await fetch(
            `http://localhost:5007/student/${isOpen ? "" : "all"}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const dataAdd = await res.json();

          const formattedData = dataAdd.students.map(
            (student: any, index: number) => ({
              id: student.id, // You can adjust how you want to generate IDs
              name: `${student.firstName} ${student.lastName}`,
              class: student.classe,
              email: student.email,
              verified: true, // or true depending on your logic
              value: parseInt(student.progress) || 0,
              joinDate: new Date(student.createdAt).toISOString().split("T")[0], // format date to "YYYY-MM-DD"
            })
          );

          setData(formattedData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchPosts();
    }, []);
  }

  // {
  //   id: "XCU-85036",
  //   name: "Fatim Al-Sayed",
  //   class: "2AS",
  //   email: "fatim.alsayed@example.com",
  //   verified: false,
  //   value: 64,
  //   joinDate: "2023-09-10",
  // },

  const [classSel, setClassSel] = useState("");

  const handleDeleteRows = () => {
    if (!isOpen) {
      const selectedRows = table.getSelectedRowModel().rows;
      const updatedData = data.filter(
        (item) => !selectedRows.some((row) => row.original.id === item.id)
      );
      setData(updatedData);
      table.resetRowSelection();
    } else {
      const selectedData = table
        .getSelectedRowModel()
        .rows.map((row) => row.original.id);
      setOpen(selectedData);
    }
  };

  async function handleClick() {
    if (open.length > 0) {
      try {
        const res = await fetch("http://localhost:5007/class", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            students: open,
            name: classSel,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to create class");
        }

        console.log("Class created successfully!");
        // Optionally, you can reset open or show a success message here
      } catch (error) {
        console.error("Error sending class creation:", error);
      }
    } else {
      console.warn("No students selected");
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  // Extract complex expressions into separate variables
  const statusColumn = table.getColumn("class");
  const statusFacetedValues = statusColumn?.getFacetedUniqueValues();
  const statusFilterValue = statusColumn?.getFilterValue();

  // Update useMemo hooks with simplified dependencies
  const uniqueStatusValues = useMemo(() => {
    if (!statusColumn) return [];
    const values = Array.from(statusFacetedValues?.keys() ?? []);
    return values.sort();
  }, [statusColumn, statusFacetedValues]);

  const statusCounts = useMemo(() => {
    if (!statusColumn) return new Map();
    return statusFacetedValues ?? new Map();
  }, [statusColumn, statusFacetedValues]);

  const selectedStatuses = useMemo(() => {
    return (statusFilterValue as string[]) ?? [];
  }, [statusFilterValue]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("class")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn("class")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <div
      className={`${
        isOpen
          ? "flex justify-center items-center"
          : isAssign
          ? "flex justify-center items-center"
          : ""
      }`}
    >
      <div
        className={`space-y-4 ${isOpen ? "w-9/10 h-[66vh]" : "full"} ${
          isAssign ? "w-9/10 h-[66vh]" : "full"
        } overflow-y-auto scroll-container`}
      >
        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left side */}
          <div className="flex items-center gap-3">
            {/* Filter by name */}
            <div className="relative">
              <Input
                id={`${id}-input`}
                ref={inputRef}
                className={cn(
                  "peer min-w-60 ps-9 bg-background bg-gradient-to-br from-accent/60 to-accent",
                  Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9"
                )}
                value={
                  (table.getColumn("name")?.getFilterValue() ?? "") as string
                }
                onChange={(e) =>
                  table.getColumn("name")?.setFilterValue(e.target.value)
                }
                placeholder="Search by name"
                type="text"
                aria-label="Search by name"
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60 peer-disabled:opacity-50">
                <RiSearch2Line size={20} aria-hidden="true" />
              </div>
              {Boolean(table.getColumn("name")?.getFilterValue()) && (
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/60 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Clear filter"
                  onClick={() => {
                    table.getColumn("name")?.setFilterValue("");
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                >
                  <RiCloseCircleLine size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Delete button */}
            {table.getSelectedRowModel().rows.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="ml-auto" variant="outline">
                    {!isOpen && (
                      <RiDeleteBinLine
                        className="-ms-1 opacity-60"
                        size={16}
                        aria-hidden="true"
                      />
                    )}
                    {isOpen && (
                      <RiAddLine
                        className="-ms-1 opacity-60"
                        size={16}
                        aria-hidden="true"
                      />
                    )}
                    {isOpen ? "Add" : "Delete"}
                    <span className="-me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                      {table.getSelectedRowModel().rows.length}
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                      aria-hidden="true"
                    >
                      <RiErrorWarningLine className="opacity-80" size={16} />
                    </div>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently{" "}
                        {isOpen ? "add" : "delete"}{" "}
                        {table.getSelectedRowModel().rows.length}{" "}
                        {table.getSelectedRowModel().rows.length === 1
                          ? "student"
                          : "students"}
                        .
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-blue-500 hover:bg-blue-700"
                      onClick={handleDeleteRows}
                    >
                      {isOpen ? "Add" : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {/* Filter by status */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <RiFilter3Line
                    className="size-5 -ms-1.5 text-muted-foreground/60"
                    size={20}
                    aria-hidden="true"
                  />
                  Filter
                  {selectedStatuses.length > 0 && (
                    <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                      {selectedStatuses.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto min-w-36 p-3" align="end">
                <div className="space-y-3">
                  <div className="text-xs font-medium uppercase text-muted-foreground/60">
                    Class
                  </div>
                  <div className="space-y-3">
                    {uniqueStatusValues.map((value, i) => (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`${id}-${i}`}
                          checked={selectedStatuses.includes(value)}
                          onCheckedChange={(checked: boolean) =>
                            handleStatusChange(checked, value)
                          }
                        />
                        <Label
                          htmlFor={`${id}-${i}`}
                          className="flex grow justify-between gap-2 font-normal"
                        >
                          {value}{" "}
                          <span className="ms-2 text-xs text-muted-foreground">
                            {statusCounts.get(value)}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Table */}
        <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="relative h-9 select-none bg-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer select-none items-center gap-2"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <RiArrowUpSLine
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <RiArrowDownSLine
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <tbody aria-hidden="true" className="table-row h-1"></tbody>
          <TableBody>
            {isLoading ? (
              <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-0 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg h-px hover:bg-accent/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="last:py-0 h-[inherit]">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <tbody aria-hidden="true" className="table-row h-1"></tbody>
        </Table>

        {/* Pagination */}
        {table.getRowModel().rows.length > 0 && (
          <div className="flex items-center justify-between gap-3">
            <p
              className="flex-1 whitespace-nowrap text-sm text-muted-foreground"
              aria-live="polite"
            >
              Page{" "}
              <span className="text-foreground">
                {table.getState().pagination.pageIndex + 1}
              </span>{" "}
              of <span className="text-foreground">{table.getPageCount()}</span>
            </p>
            <Pagination className="w-auto">
              <PaginationContent className="gap-3">
                <PaginationItem>
                  <Button
                    variant="outline"
                    className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to previous page"
                  >
                    Previous
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="outline"
                    className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to next page"
                  >
                    Next
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        {isOpen && (
          <div className="flex justify-between items-center mt-6 [@media(max-width:550px)]:flex-col">
            <div className="p-6 [@media(max-width:550px)]:flex [@media(max-width:550px)]:flex-col">
              <Label className="pb-4 [@media(max-width:550px)]:pb-1 text-md [@media(max-width:550px)]:text-center w-ful">Class name:</Label>
              <Input
                className="mt-1 border-2 w-full"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setClassSel(e.target.value)
                }
              ></Input>
            </div>
            <div className="flex justify-end gap-2 mt-6 [@media(max-width:550px)]:mt-0">
              <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleClick}
              >
                Create
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RowActions({
  setData,
  data,
  item,
}: {
  setData: React.Dispatch<React.SetStateAction<Item[]>>;
  data: Item[];
  item: Item;
}) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleStatusToggle = () => {
    startUpdateTransition(() => {
      const updatedData = data.map((dataItem) => {
        if (dataItem.id === item.id) {
          return {
            ...dataItem,
            verified: item.verified === true ? false : true,
          };
        }
        return dataItem;
      });
      setData(updatedData);
    });
  };

  const handleVerifiedToggle = () => {
    startUpdateTransition(() => {
      const updatedData = data.map((dataItem) => {
        if (dataItem.id === item.id) {
          return {
            ...dataItem,
            verified: !item.verified,
          };
        }
        return dataItem;
      });
      setData(updatedData);
    });
  };

  const handleDelete = () => {
    startUpdateTransition(() => {
      const updatedData = data.filter((dataItem) => dataItem.id !== item.id);
      setData(updatedData);
      setShowDeleteDialog(false);
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none text-muted-foreground/60"
              aria-label="Edit item"
            >
              <RiMoreLine className="size-5" size={20} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={handleVerifiedToggle}
              disabled={isUpdatePending}
            >
              {item.verified ? "Unverify contact" : "Verify contact"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="data-[variant=destructive]:focus:bg-blue-100 data-[variant=destructive]:hover:bg-blue-100"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              contact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdatePending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isUpdatePending}
              className="bg-blue-500 hover:bg-blue-700 text-white shadow-xs focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
