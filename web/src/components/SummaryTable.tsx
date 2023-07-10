import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { api } from '../lib/axios'
import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning'
import { HabitDay } from './HabitDay'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

// Variável para executar a função
const summaryDates = generateDatesFromYearBeginning()

// Variável que diz o mínimo de dias (quadradinhos) VISÍVEIS na aplicação
const minimumSummaryDatesSize = 18 * 7 // 18 semanas
// Variável responsável pelo cálculo dos quadradinhos que já foram disponíbilizados para uso e dos que irão disponibilizar
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

type Summary = {
	id: string
	date: string
	amount: number
	completed: number
}[]

export function SummaryTable() {
	const [summary, setSummary] = useState<Summary>([])

	useEffect(() => {
		api.get('/summary').then((response) => {
			setSummary(response.data)
		})
	}, [])

	return (
		<div className="w-full flex ">
			<div className="grid grid-rows-7 grid-flow-row gap-3">
				{/* Usa o método .map() para percorrer o array e retornar o valor do array */}
				{weekDays.map((weekDays, i) => {
					return (
						<div
							// Interpolação do dia da semana - o index, assim irá resultar em um valor diferente de apenas 'S' ou 'Q', que repetem no array.
							key={`${weekDays} - ${i}`}
							className="text-zinc-400 font-bold text-xl h-10 w-10 flex items-center justify-center"
						>
							{weekDays}
						</div>
					)
				})}
			</div>

			<div className="grid grid-rows-7 grid-flow-col gap-3">
				{/* Percorre esse Array, para que em cada data, retornar um HabitDay (quadradinhos) */}
				{summary.length > 0 &&
					summaryDates.map((date) => {
						const dayInSummary = summary.find((day) => {
							return dayjs(date).isSame(day.date, 'day')
						})

						// A Key não aceita formato DateTime, logo transformamos em String
						return (
							<HabitDay
								key={date.toString()}
								date={date}
								defaultAmount={dayInSummary?.amount}
								defaultCompleted={dayInSummary?.completed}
							/>
						)
					})}
				{/* Verifico se os dias restantes para preencher a tabela de dias é maior que 0, porque se for, ele cria um HabitDay sem interação (placeholder) 
				
				Esse método Array.from() cria um array com um tamanho predefinido, que no caso é os dias que estão por vir (placeholders)
				*/}
				{amountOfDaysToFill > 0 &&
					Array.from({ length: amountOfDaysToFill }).map((_, i) => {
						return (
							<div>
								<div
									// Nesse caso específico, como o Array não tem um valor, somente indexes, podemos usar o próprio index (i) como key
									key={i}
									className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
								/>
							</div>
						)
					})}
			</div>
		</div>
	)
}