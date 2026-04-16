'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteClient } from '../actions';

export default function DeleteClientBtn({ clientId, clientName }: { clientId: string, clientName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm(`Tem certeza que deseja excluir o cliente "${clientName}" e todo o seu histórico?\nEssa ação não pode ser desfeita.`)) {
      setIsDeleting(true);
      try {
        await deleteClient(clientId);
        router.push('/clients');
        router.refresh();
      } catch (error) {
        console.error(error);
        alert('Erro ao excluir cliente. Verifique o console.');
        setIsDeleting(false);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 16px', background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px',
        color: '#ef4444', cursor: isDeleting ? 'not-allowed' : 'pointer',
        fontSize: '13px', fontWeight: '700', transition: 'all 0.2s',
        opacity: isDeleting ? 0.5 : 1
      }}
    >
      <Trash2 size={16} />
      {isDeleting ? 'Excluindo...' : 'Excluir Cliente'}
    </button>
  );
}
