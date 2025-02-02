import axios from 'api';
import { ErrorResponseHandler } from 'api/ErrorResponseHandler';
import { AxiosError } from 'axios';
import { SOMETHING_WENT_WRONG } from 'constants/api';
import { MessagingQueueServiceDetailType } from 'pages/MessagingQueues/MessagingQueuesUtils';
import { ErrorResponse, SuccessResponse } from 'types/api';

export interface MessagingQueueServicePayload {
	start?: number | string;
	end?: number | string;
	variables: {
		partition?: string;
		topic?: string;
		consumer_group?: string;
		service_name?: string;
	};
	detailType?: MessagingQueueServiceDetailType | 'producer' | 'consumer';
}

export interface MessagingQueuesPayloadProps {
	status: string;
	payload: {
		resultType: string;
		result: {
			table: {
				columns: {
					name: string;
					queryName: string;
					isValueColumn: boolean;
				}[];
				rows: {
					data: Record<string, string>;
				}[];
			};
		}[];
	};
}

export const getConsumerLagDetails = async (
	props: MessagingQueueServicePayload,
): Promise<
	SuccessResponse<MessagingQueuesPayloadProps['payload']> | ErrorResponse
> => {
	const { detailType, ...restProps } = props;
	try {
		const response = await axios.post(
			`/messaging-queues/kafka/consumer-lag/${props.detailType}`,
			{
				...restProps,
			},
		);

		return {
			statusCode: 200,
			error: null,
			message: response.data.status,
			payload: response.data.data,
		};
	} catch (error) {
		return ErrorResponseHandler((error as AxiosError) || SOMETHING_WENT_WRONG);
	}
};
