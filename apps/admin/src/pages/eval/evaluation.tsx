import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { useState } from "react";
import { useEffect } from "react";
type Topikos = {
  Topiko: string;
  Rating: number;
  id: string;
};

function evaluation() {
  const [topic, setTopic] = useState<Topikos[]>([]);
  useEffect(() => {
    fetch("https://673180b37aaf2a9aff10d291.mockapi.io/topiko")
      .then((response) => response.json())
      .then((data) => {
        setTopic(data);
      });
  }, []);

  return (
    <>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] font-extrabold text-black">
                Name
              </TableHead>
              <TableHead className="font-bold">Evaluation</TableHead>
              <TableHead className="font-bold">Rating</TableHead>
              <TableHead className="font-bold">Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topic.map((beneficiary) => (
              <TableRow key={beneficiary.Topiko}>
                <TableCell className="font-medium">
                  {beneficiary.Topiko}
                </TableCell>
                <TableCell>{beneficiary.Rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableCaption className="flex">
          1 = Poor, 2 = Fair, 3 = Good, 4 = Very Good, 5 = Excellent
        </TableCaption>
      </div>
    </>
  );
}

export default evaluation;
