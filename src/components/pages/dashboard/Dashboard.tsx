
import { db } from "../../firebase/firebaseConfig"
import { collection, onSnapshot } from 'firebase/firestore';

import Dados  from "@/components/dados";
import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  interface Negociacao {
    id: string;
    data_contrato: string;
    cliente: string;
    servico_produto: string;
    valor_total: number;
    etapas: string;
    feedback: string;
    status: string;
    motivo_perda: string;
  }


  const Dashboard: React.FC = () => {
    const [negociacoes, setNegociacoes] = useState<Negociacao[]>([]);
    const [totalAprovado, setTotalAprovado] = useState<number>(0);
    const [qtdVendas, setQtdVendas] = useState<number>(0);
    const [percentualSucesso, setPercentualSucesso] = useState<number>(0);

    useEffect(() => {
        const q = collection(db, "negociacoes");

        // Listener para atualizar em tempo real
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data: Negociacao[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Negociacao[];

            setNegociacoes(data);

            // Filtra negociações aprovadas
            const aprovadas = data.filter(negociacao => negociacao.status === "Aprovada");

            // Calcula soma dos valores aprovados
            const somaAprovados = aprovadas.reduce((acc, negociacao) => acc + negociacao.valor_total, 0);
            setTotalAprovado(somaAprovados);

            // Quantidade de vendas aprovadas
            const qtdAprovadas = aprovadas.length;
            setQtdVendas(qtdAprovadas);

            // Percentual de sucesso
            const totalNegociacoes = data.length;
            const percentual = totalNegociacoes > 0 ? (qtdAprovadas / totalNegociacoes) * 100 : 0;
            setPercentualSucesso(percentual);
        });

        return () => unsubscribe(); // Remove o listener ao desmontar o componente
    }, []);

    return(
        <>
        <section className="grid sm:grid-cols-4  gap-4 mt-5 w-[95%] m-auto">
        <Card>
            <CardHeader>
                <CardTitle>Qtd. de Negociações</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="bg-[#D9D9D9] p-3 rounded-[6px] text-2xl font-bold">{negociacoes.length ? negociacoes.length : "Carregando..."}</p>
            </CardContent>
     
        </Card>

        
        <Card>
            <CardHeader>
                <CardTitle>Qtd. de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="bg-[#D9D9D9] p-3 text-2xl font-bold rounded-[6px]">{qtdVendas ? qtdVendas : "Carregando..."}</p>
            </CardContent>

        </Card>

        
        <Card>
            <CardHeader>
                <CardTitle>% de Sucesso</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="bg-[#D9D9D9] p-3 rounded-[6px] text-2xl font-bold">{percentualSucesso ? percentualSucesso + "%" : "Carregando..."}</p>
            </CardContent>

        </Card>

        
        <Card>
            <CardHeader>
                <CardTitle>Valor de Vendas</CardTitle>
            </CardHeader>
            <CardContent >
                <p className="bg-[#D9D9D9] p-3 rounded-[6px] text-2xl font-bold">
                  R$ {totalAprovado ? totalAprovado.toFixed(2) : "Carregando..."}
                </p>
            </CardContent>

        </Card>


        </section>

        <section>
            <Dados />
        </section>

        </>

    )
}

export default Dashboard;

