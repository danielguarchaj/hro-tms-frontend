import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Skeleton } from "@mui/material";

const TableSkeletonLoader = ({ rowsCount, columnsCount }) => {
  return [...Array(rowsCount)].map((_row, indexRow) => (
    <TableRow key={`table-row-skeleton-key-${indexRow}`}>
      {[...Array(columnsCount)].map((_column, indexCol) => (
        <TableCell
          component="th"
          scope="row"
          key={`table-column-skeleton-key-${indexCol}`}
        >
          <Skeleton animation="wave" variant="text" />
        </TableCell>
      ))}
    </TableRow>
  ));
};

export default TableSkeletonLoader;
