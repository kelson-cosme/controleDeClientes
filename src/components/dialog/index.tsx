import {  useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { db } from "../firebase/firebaseConfig"
import { collection, addDoc,updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Negociacao } from "@/lib/types"; // Ajuste o caminho conforme necessário

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  negociacaoSelecionada: Negociacao | null;
}


const Modal: React.FC<ModalProps> = ({ showModal, setShowModal, negociacaoSelecionada }) =>{
  
  const [cliente, setCliente] = useState(negociacaoSelecionada?.cliente || "");
  const [dataContrato, setDataContrato] = useState(
    negociacaoSelecionada?.data_contrato ? new Date(negociacaoSelecionada.data_contrato.seconds * 1000).toISOString().split("T")[0] : ""
  );
  const [servicoProduto, setServicoProduto] = useState(negociacaoSelecionada?.servico_produto || "");
const [valorTotal, setValorTotal] = useState(negociacaoSelecionada?.valor_total?.toString() || "");
  const [feedback, setFeedback] = useState(negociacaoSelecionada?.feedback || "");
  const [status, setStatus] = useState(negociacaoSelecionada?.status || "");
  const [motivoPerda, setMotivoPerda] = useState(negociacaoSelecionada?.motivo_perda || "");


  useEffect(() => {
    if (!showModal) {
      setCliente("");
      setDataContrato("");
      setServicoProduto("");
      setValorTotal("");
      setFeedback("");
      setStatus("");
      setMotivoPerda("");
    } else if (negociacaoSelecionada) {
      setCliente(negociacaoSelecionada.cliente);
      setDataContrato(
        negociacaoSelecionada.data_contrato
          ? new Date(negociacaoSelecionada.data_contrato.seconds * 1000).toISOString().split("T")[0]
          : ""
      );
      setServicoProduto(negociacaoSelecionada.servico_produto);
      setValorTotal(negociacaoSelecionada.valor_total.toString());
      setFeedback(negociacaoSelecionada.feedback);
      setStatus(negociacaoSelecionada.status);
      setMotivoPerda(negociacaoSelecionada.motivo_perda || "");
    }
  }, [negociacaoSelecionada]);

  const salvarNegociacao = async () => {
    if (!cliente.trim() || !dataContrato || !servicoProduto.trim() || !valorTotal || !status.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const [ano, mes, dia] = dataContrato.split("-");
      const dataAjustada = new Date(Number(ano), Number(mes) - 1, Number(dia), 12, 0, 0);

      if (negociacaoSelecionada) {
        // Se existe negociação, faz update
        await updateDoc(doc(db, "negociacoes", negociacaoSelecionada.id), {
          cliente,
          data_contrato: dataAjustada,
          servico_produto: servicoProduto,
          valor_total: Number(valorTotal),
          feedback,
          status,
          motivo_perda: motivoPerda,
        });
        alert("Negociação atualizada com sucesso!");
       
      } else {
        // Caso contrário, cria uma nova
        await addDoc(collection(db, "negociacoes"), {
          cliente,
          data_contrato: dataAjustada,
          servico_produto: servicoProduto,
          valor_total: Number(valorTotal),
          feedback,
          status,
          motivo_perda: motivoPerda,
          etapas: "",
        });
        alert("Nova negociação adicionada!");
      }

      setShowModal(false);
    } catch (error) {
      console.error("Erro ao salvar negociação: ", error);
    }
  };

  const excluirRegistro = async () => {
    if (negociacaoSelecionada) {
      const confirmacao = window.confirm(`Tem certeza que quer excluir o registro do dia: ${negociacaoSelecionada.id}?`);
  
      if (confirmacao) {
        try {
          const docRef = doc(db, "negociacoes", negociacaoSelecionada.id);
          await deleteDoc(docRef);
  
          alert(`Registro com ID: ${negociacaoSelecionada.id} excluído com sucesso!`);
  
          setShowModal(false); // Fechar modal após a exclusão
        } catch (error) {
          console.error("Erro ao excluir o registro:", error);
        }
      }
    }
  };

  return(
    <>
      <button onClick={() => {
        setShowModal(true);
        setCliente("");
        setDataContrato("");
        setServicoProduto("");
        setValorTotal("");
        setFeedback("");
        setStatus("");
        setMotivoPerda("");
      }} className="bg-green-500 text-amber-50 pt-2 pb-2 pl-7 pr-7 red rounded-[10px] m-auto block mt-5">
        Adicionar
      </button>    

      {showModal && (
        <div onClick={() => setShowModal(false)} className="fixed flex items-center justify-center top-0 w-full h-full bg-neutral-900">
          <div onClick={(e) => e.stopPropagation()} className="overflow-y-scroll relative rounded-[1vw] bg-white sm:w-1/2 w-[98%] h-[90%] p-5">
            <button onClick={() => setShowModal(false)} className="absolute top-0 right-0 block text-white p-3 bg-red-600">
              Fechar
            </button>

            <div className="mb-[1.5vh]">
              <Label>Data do Contato:</Label>
              <Input className="w-auto" type="date" value={dataContrato} onChange={(e) => setDataContrato(e.target.value)} />
            </div>

            <div className="mb-[1.5vh]">
              <Label>Cliente:</Label>
              <Input className="w-full" type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} />
            </div>

            <div className="mb-[1.5vh]">
              <Label>Serviço ou Produto:</Label>
              <Input className="w-full" type="text" value={servicoProduto} onChange={(e) => setServicoProduto(e.target.value)} />
            </div>

            <div className="mb-[1.5vh]">
              <Label>Valor:</Label>
              <Input className="w-full" type="number" value={valorTotal} onChange={(e) => setValorTotal(e.target.value)} />
            </div>

            <div className="mb-[1.5vh]">
              <Label>Feedback:</Label>
              <Input className="w-full" type="text" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            </div>

            <div className="mb-[1.5vh]">
              <Label>Status de Negociação:</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Escolha o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em andamento">Em Andamento</SelectItem>
                  <SelectItem value="Aprovada">Aprovada</SelectItem>
                  <SelectItem value="Reprovada">Reprovada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-[1.5vh]">
              <Label>Motivo da perda:</Label>
              <Textarea className="w-full h-[15vh]" value={motivoPerda}  onChange={(e) => setMotivoPerda(e.target.value)} />
            </div>

            <button onClick={salvarNegociacao} className="bg-blue-500 text-white px-4 py-2 rounded block m-auto">
              {negociacaoSelecionada ? "Atualizar Negociação" : "Salvar Negociação"}
            </button>

            <button onClick={excluirRegistro } className="bg-red-500 text-white px-4 py-2 rounded block m-auto mt-2">Excluir</button>
          </div>
        </div>
      )}

    </>
  )
}

export default Modal