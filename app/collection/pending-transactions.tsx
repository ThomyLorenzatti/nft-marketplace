import { DollarSign, Clock, Send, XCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

interface PendingTransaction {
  id: string
  type: 'buy' | 'send' | 'receive'
  status: 'pending'
  nftId: string
  from: string
  to: string
  amount: string
  createdAt: string
  qrCode?: string // QR code URL après acceptation/refus
}

interface PendingTransactionsProps {
  transactions: PendingTransaction[]
  onAccept?: (txId: string) => Promise<{ qrCodeUrl: string } | void>
  onReject?: (txId: string) => Promise<{ qrCodeUrl: string } | void>
}

export function PendingTransactions({ transactions, onAccept, onReject }: PendingTransactionsProps) {
  const [selectedTx, setSelectedTx] = useState<PendingTransaction | null>(null)
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  
  const handleAccept = async (tx: PendingTransaction) => {
    try {
      const response = await onAccept?.(tx.id)
      console.log('Accept response:', response)
      if (response && 'qrCodeUrl' in response) {
        setQrCodeUrl(response.qrCodeUrl)
        setShowQRCode(true)
      }
    } catch (error) {
      console.error('Error accepting transaction:', error)
    }
  }

  const handleReject = async (tx: PendingTransaction) => {
    try {
      const response = await onReject?.(tx.id)
      if (response && 'qrCodeUrl' in response) {
        setQrCodeUrl(response.qrCodeUrl)
        setShowQRCode(true)
      }
    } catch (error) {
      console.error('Error rejecting transaction:', error)
    }
  }


  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy': return <DollarSign className="h-6 w-6 text-primary" />
      case 'send': return <Send className="h-6 w-6 text-secondary" />
      case 'receive': return <Send className="h-6 w-6 text-secondary rotate-180" />
      default: return <Clock className="h-6 w-6 text-muted-foreground" />
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'buy': return "Offre d'achat envoyée"
      case 'send': return "Envoi en attente"
      case 'receive': return "Réception en attente"
      default: return "Transaction en attente"
    }
  }

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {transactions.map((tx) => (
        <div 
          key={tx.id}
          className="glass-effect p-4 rounded-xl border border-primary/30 flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-background/50 flex items-center justify-center">
              {getTransactionIcon(tx.type)}
            </div>
            <div>
              <h3 className="font-medium text-sm">
                {getTransactionLabel(tx.type)}
              </h3>
              <p className="text-xs text-muted-foreground">
                NFT #{tx.nftId.slice(-4)}
              </p>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            className="w-full mt-2"
            onClick={() => setSelectedTx(tx)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Consulter
          </Button>
        </div>
      ))}
    </div>

    <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
      {selectedTx && (
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getTransactionIcon(selectedTx.type)}
              {getTransactionLabel(selectedTx.type)}
            </DialogTitle>
          </DialogHeader>
          
            {/* <div className="space-y-4"> */}
            <div className="glass-effect p-4 rounded-lg border border-primary/30 space-y-3">
              <div className="text-sm">
              <p className="text-muted-foreground">NFT ID</p>
              <p className="font-medium break-all">{selectedTx.nftId}</p>
              </div>

              {selectedTx.type === 'buy' ? (
              <div className="text-sm">
                <p className="text-muted-foreground">Prix proposé</p>
                <p className="font-medium text-primary">
                {Number(selectedTx.amount) / 1000000} XRP
                </p>
              </div>
              ) : (
              <>
                <div className="text-sm">
                <p className="text-muted-foreground">De</p>
                <p className="font-medium break-all">{selectedTx.from}</p>
                </div>
                <div className="text-sm">
                <p className="text-muted-foreground">À</p>
                <p className="font-medium break-all">{selectedTx.to}</p>
                </div>
              </>
              )}
            </div>

            {showQRCode ? (
              <div className="space-y-4">
                <div className="glass-effect p-4 rounded-lg border border-primary/30">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-muted-foreground text-center">
                      Scannez le QR code avec l'application XUMM pour 
                      {selectedTx.type === 'receive' ? " accepter" : " annuler"} 
                      la transaction
                    </p>
                    {qrCodeUrl && (
                      <div className="relative aspect-square w-full max-w-[200px] mx-auto">
                        <img
                          src={qrCodeUrl}
                          alt="QR Code XUMM"
                          className="rounded-lg border border-primary/30"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowQRCode(false)
                      setQrCodeUrl(null)
                    }}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* ... existing transaction details ... */}
                
                <div className="flex gap-2 justify-end">
                  {selectedTx.type === 'receive' && onAccept && onReject && (
                    <>
                      <Button
                        onClick={() => handleAccept(selectedTx)}
                        className="bg-primary text-primary-foreground hover:bg-primary/80"
                      >
                        Accepter
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleReject(selectedTx)}
                        className="text-destructive hover:text-destructive hover:border-destructive"
                      >
                        Refuser
                      </Button>
                    </>
                  )}
                  {selectedTx.type === 'buy' && (
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedTx)}
                      className="text-destructive hover:text-destructive hover:border-destructive"
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
      )}
    </Dialog>
  </>
  )
}