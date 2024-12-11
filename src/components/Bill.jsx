import {Popover, PopoverTrigger, PopoverContent} from "@nextui-org/popover";

export default function Bill ({bill, ...props}) {

    return (
        <>
        { !bill && (
            <>
                { props.children }
            </>
        )}
        { bill && (
            <Popover placement="bottom">
                <PopoverTrigger>
                    {props.children}
                </PopoverTrigger>
                <PopoverContent>
                    <div className="px-1 py-2">
                        <div className="text-small font-bold">Rechnung</div>
                        <table>
                            <tbody>
                                { bill.map( ( line, idx, array ) => (
                                    <tr className={"text-small " + ((idx === (array.length-1)) ? "divide-y divide-gray-700" : "")}>
                                        <td>{ line.item }</td>
                                        <td></td>
                                        <td className="text-right">{ line.value}</td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                        <div className="text-tiny">ohne jegliche Gewähr</div>
                    </div>
                </PopoverContent>
            </Popover>
        )}
        </>
    );
};