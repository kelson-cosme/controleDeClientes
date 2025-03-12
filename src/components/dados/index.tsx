import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"

import { db } from "@/components/firebase/firebaseConfig"
import { collection, onSnapshot } from 'firebase/firestore';
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br"); // Define o locale para português

import { Negociacao } from "@/lib/types"; // Ajuste o caminho conforme necessário


const chartConfig = {
  aprovada: {
    label: "Aprovada",
    color: "green",
  },
  reprovada: {
    label: "Reprovada",
    color: "red",
  },
  andamento: {
    label: "Andamento",
    color: "yellow",
  },
} satisfies ChartConfig

const Dashboard: React.FC = () => {
  const [chartData, setChartData] = useState<
    { month: string; qtdAprovadas: number; qtdReprovadas: number; qtdEmAndamento: number; totalAprovado: number }[]
  >([]);

  useEffect(() => {
    const q = collection(db, "negociacoes");

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: Negociacao[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Negociacao[];

      const dadosAgrupados: { [mesAno: string]: any } = {};

      data.forEach((negociacao) => {
        const dataContrato = negociacao.data_contrato?.toDate
          ? dayjs(negociacao.data_contrato.toDate())
          : dayjs(negociacao.data_contrato);
        const mesAno = dataContrato.format("YYYY-MM"); // Exemplo: "2025-03"

        if (!dadosAgrupados[mesAno]) {
          dadosAgrupados[mesAno] = {
            totalAprovado: 0,
            qtdAprovadas: 0,
            qtdReprovadas: 0,
            qtdEmAndamento: 0,
          };
        }

        // Contabiliza os status
        if (negociacao.status === "Aprovada") {
          dadosAgrupados[mesAno].totalAprovado += negociacao.valor_total;
          dadosAgrupados[mesAno].qtdAprovadas += 1;
        } else if (negociacao.status === "Reprovada") {
          dadosAgrupados[mesAno].qtdReprovadas += 1;
        } else if (negociacao.status === "Em andamento") {
          dadosAgrupados[mesAno].qtdEmAndamento += 1;
        }
      });

      // Gerar os meses automaticamente e preencher com zero se não houver dados
      const meses = Array.from({ length: 12 }, (_, i) => {
        const mesAno = dayjs().month(i).format("YYYY-MM");
        return {
          month: dayjs().month(i).format("MMMM"), // Nome do mês em português
          qtdAprovadas: dadosAgrupados[mesAno]?.qtdAprovadas || 0,
          qtdReprovadas: dadosAgrupados[mesAno]?.qtdReprovadas || 0,
          qtdEmAndamento: dadosAgrupados[mesAno]?.qtdEmAndamento || 0,
          totalAprovado: dadosAgrupados[mesAno]?.totalAprovado || 0,
        };
      });

      setChartData(meses);
    });

    return () => unsubscribe();
  }, []);
  return (
    <>
      <ChartContainer config={chartConfig} className="block m-auto min-h-[200px] sm:w-1/2 mt-5">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
        dataKey="month"
        tickLine={false}
        tickMargin={10}
        axisLine={false}
        tickFormatter={(value) => value.slice(0, 3)}
      />
          <ChartTooltip content={<ChartTooltipContent />} />

          <Bar dataKey="qtdAprovadas" fill="var(--color-aprovada)" radius={2} name="Aprovadas " />
          <Bar dataKey="qtdReprovadas" fill="var(--color-reprovada)" radius={2} name="Reprovadas " />
          <Bar dataKey="qtdEmAndamento" fill="var(--color-andamento)" radius={2} name="Andamento " />
        </BarChart>
      </ChartContainer>
    </>
  )
}

export default Dashboard;
