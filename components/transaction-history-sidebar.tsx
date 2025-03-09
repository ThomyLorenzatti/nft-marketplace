import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { 
  Hammer, 
  Tag, 
  ArrowRightLeft, 
  Trash2,
  XCircle,
  CheckCircle2,
  History,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Transaction {
  id: string
  type: string
  date: string
  fee: number
  success: boolean
  details: any
}

interface TransactionHistorySidebarProps {
  account: string
}

export function TransactionHistorySidebar({ account }: TransactionHistorySidebarProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/xrp/transactions/${account}`)
        const data = await response.json()
        if (data.success) {
          setTransactions(data.transactions)
        }
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    if (account) {
      fetchTransactions()
    }
  }, [account])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'NFTokenMint': return <Hammer className="h-4 w-4" />
      case 'NFTokenCreateOffer': return <Tag className="h-4 w-4" />
      case 'NFTokenAcceptOffer': return <ArrowRightLeft className="h-4 w-4" />
      case 'NFTokenBurn': return <Trash2 className="h-4 w-4" />
      case 'NFTokenCancelOffer': return <XCircle className="h-4 w-4" />
      default: return null
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'NFTokenMint': return 'Création de NFT'
      case 'NFTokenCreateOffer': return 'Création d\'offre'
      case 'NFTokenAcceptOffer': return 'Acceptation d\'offre'
      case 'NFTokenBurn': return 'Destruction de NFT'
      case 'NFTokenCancelOffer': return 'Annulation d\'offre'
      default: return type
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-50 rounded-l-xl rounded-r-none border border-r-0 border-primary/30",
          isOpen && "right-80"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <>
            <History className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4" />
          </>
        )}
      </Button>

      <div
        className={cn(
          "fixed right-0 top-0 h-screen w-80 bg-background/95 backdrop-blur-sm border-l border-primary/30 pt-32 px-4 transition-transform duration-300 ease-in-out",
          !isOpen && "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Historique des transactions</h2>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-lg animate-pulse bg-muted"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="glass-effect p-3 rounded-lg border border-primary/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTransactionIcon(tx.type)}
                    <span className="text-sm font-medium">
                      {getTransactionLabel(tx.type)}
                    </span>
                  </div>
                  {tx.success ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{format(new Date(tx.date), 'dd MMM yyyy HH:mm', { locale: fr })}</span>
                  <span>{tx.fee} XRP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}