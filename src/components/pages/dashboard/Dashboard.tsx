
import { db } from "../../firebase/firebaseConfig"
import { collection, onSnapshot } from 'firebase/firestore';

import { Dados } from "@/components/dados";
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

  useEffect(() => {
    const q = collection(db, "negociacoes");

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
        <>

        {negociacoes && console.log(negociacoes.length)}
        {negociacoes && negociacoes.map((doc) => (
          console.log(doc.valor_total)
        ))}

        <section className="grid sm:grid-cols-4  gap-4 mt-5 w-[95%] m-auto">
        <Card>
            <CardHeader>
                <CardTitle>Qtd. de Negociações</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="bg-[#D9D9D9] p-3 rounded-[6px]">{negociacoes.length}</p>
            </CardContent>
     
        </Card>

        
        <Card>
            <CardHeader>
                <CardTitle>Qtd. de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="bg-[#D9D9D9] p-3 rounded-[6px]">Card Content</p>
            </CardContent>

        </Card>

        
        <Card>
            <CardHeader>
                <CardTitle>% de Sucesso</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="bg-[#D9D9D9] p-3 rounded-[6px]">Card Content</p>
            </CardContent>

        </Card>

        
        <Card>
            <CardHeader>
                <CardTitle>Valor de Vendas</CardTitle>
            </CardHeader>
            <CardContent >
                <p className="bg-[#D9D9D9] p-3 rounded-[6px]">Card Content</p>
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


// import React, { useEffect, useState } from 'react';
// import { collection, onSnapshot } from 'firebase/firestore';
// import { db } from '../../firebase/firebaseConfig';

// interface Negociacao {
//   id: string;
// }

// const MyComponent: React.FC = () => {
//     const [negociacoes, setNegociacoes] = useState<Negociacao[]>([]);

//   useEffect(() => {
//     const q = collection(db, "negociacoes");

//           // Listener para atualizar em tempo real
//           const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             const data: Negociacao[] = querySnapshot.docs.map(doc => ({
//               id: doc.id,
//               ...doc.data(),
//             })) as Negociacao[];
            
//             setNegociacoes(data);
//           });
        
//           return () => unsubscribe(); // Remove o listener ao desmontar o componente
//   }, []);

//   return (
//     <div>
//       {console.log(negociacoes.length)}
//         {negociacoes && negociacoes.map((doc) => (
//             <h1>{doc.id}</h1>

//         ))}
//     </div>
//   );
// };

// export default MyComponent;
