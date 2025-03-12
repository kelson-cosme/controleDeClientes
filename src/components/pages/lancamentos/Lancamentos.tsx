import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"



import  { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig"; // Importa a configuração do Firestore
import { collection, Timestamp, query, orderBy, onSnapshot  } from "firebase/firestore"; // Importa métodos do Firestore    
import Modal from "@/components/dialog";
import { Negociacao } from "@/lib/types"; // Ajuste o caminho conforme necessário

  
function Lancamentos(){
    const [negociacoes, setNegociacoes] = useState<Negociacao[]>([]);

    const [negociacaoSelecionada, setNegociacaoSelecionada] = useState<Negociacao | null>(null);
    const [showModal, setShowModal] = useState(false);
    
    const abrirModalEdicao = (negociacao: Negociacao) => {
      setNegociacaoSelecionada(negociacao);
      setShowModal(true);
    };

    const formatarData = (data: string | Timestamp) => {
        if (typeof data === "string") {
          return new Date(data).toLocaleDateString();
        } else if (data instanceof Timestamp) {
          return data.toDate().toLocaleDateString();
        }
        return "Data inválida";
      };

      useEffect(() => {
        const q = query(collection(db, "negociacoes"), orderBy("data_contrato", "asc"));
      
        // Listener para atualizar em tempo real
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const data: Negociacao[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Negociacao[];
          
          setNegociacoes(data);
        });
      
        return () => unsubscribe(); // Remove o listener ao desmontar o componente
      }, []);

    return(
        <div className="max-2xl:w-full w-[80%] block m-auto">

        <Table className="mt-5.5">
            <TableHeader>
                <TableRow className="bg-[#292323] text-[#ffff]">
                <TableHead className="">Data de contato</TableHead>
                <TableHead>Clientes</TableHead>
                <TableHead>Serviço ou Produto</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>FeedBack</TableHead>
                <TableHead>Status de Negociação</TableHead>
                <TableHead >Motivo da perda</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
              {negociacoes &&
                negociacoes.map((negociacao) => (
                  <TableRow
                    key={negociacao.id}
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => abrirModalEdicao(negociacao)}
                  >
                    <TableCell>{formatarData(negociacao.data_contrato)}</TableCell>
                    <TableCell>{negociacao.cliente}</TableCell>
                    <TableCell>{negociacao.servico_produto}</TableCell>
                    <TableCell>R$ {negociacao.valor_total.toFixed(2)}</TableCell>
                    <TableCell>{negociacao.feedback}</TableCell>
                    
                    {/* Aplicando cores conforme o status */}
                    <TableCell
                      className={`
                        px-2 py-1 rounded text-white text-center
                        ${
                          negociacao.status === "Em andamento" ? "bg-yellow-500" :
                          negociacao.status === "Aprovada" ? "bg-green-500" :
                          negociacao.status === "Reprovada" ? "bg-red-500" :
                          "bg-gray-300"
                        }
                      `}
                    >
                      {negociacao.status}
                    </TableCell>

                    <TableCell>{negociacao.motivo_perda || "N/A"}</TableCell>
                  </TableRow>
                ))}
            </TableBody>

              </Table>     
    
              <Modal showModal={showModal} setShowModal={setShowModal} negociacaoSelecionada={negociacaoSelecionada} />

        </div>
    )
}

export default Lancamentos