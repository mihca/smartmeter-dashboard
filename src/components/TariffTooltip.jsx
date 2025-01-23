import { Tooltip } from "@heroui/tooltip";
import { VAT_RATE } from "../features/tariff-calculator/calculator.js";
import { formatEUR } from "../scripts/round.js";

export default function TariffTooltip ({tariff, ...props}) {

    return (
        <Tooltip content={
            <div className="px-1 py-2 text-small">
                <div className="font-bold">{tariff.name}</div>
                <div className="text-small">{tariff.description}</div>
                <div className="text-small">Anbieter: {tariff.company}</div>
                { typeof tariff.base_fee_monthly_eur==='number' && (
                    <div className="text-small">Grundgebühr: {formatEUR(tariff.base_fee_monthly_eur*(100+VAT_RATE)/100)}</div>
                )}
                { typeof tariff.base_fee_yearly_eur==='number' && (
                    <div className="text-small">Grundgebühr: {formatEUR(tariff.base_fee_yearly_eur*(100+VAT_RATE)/100/12)}</div>
                )}
                { tariff.link_url && (
                    <div className="text-small"><a href={tariff.link_url} target="_blank" className="hover:underline">- Details</a></div>
                )}
                { tariff.link_pdf && (
                    <div className="text-small"><a href={tariff.link_pdf} target="_blank" className="hover:underline">- Tarifblatt</a></div>
                )}
                </div>
        }>
            { props.children }
        </Tooltip>
    );
};