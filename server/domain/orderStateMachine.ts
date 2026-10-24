export type OrderLifecycleStatus =
  | 'awaiting_laundry_confirmation'
  | 'accepted'
  | 'rejected'
  | 'awaiting_pickup'
  | 'pickup_assigned'
  | 'collected'
  | 'received_at_laundry'
  | 'inspection_required'
  | 'awaiting_customer_approval'
  | 'processing'
  | 'ready_for_delivery'
  | 'delivery_assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface TransitionContext {
  orderId: string;
  fromStatus: OrderLifecycleStatus;
  toStatus: OrderLifecycleStatus;
  actorUserId: string;
  actorName: string;
  actorRole: string;
  note?: string;
}

// Permitted transition graph
const VALID_TRANSITIONS: Record<OrderLifecycleStatus, OrderLifecycleStatus[]> = {
  awaiting_laundry_confirmation: ['accepted', 'rejected', 'inspection_required', 'cancelled'],
  accepted: ['awaiting_pickup', 'pickup_assigned', 'cancelled'],
  rejected: [],
  awaiting_pickup: ['pickup_assigned', 'collected', 'cancelled'],
  pickup_assigned: ['collected', 'awaiting_pickup', 'cancelled'],
  collected: ['received_at_laundry', 'inspection_required'],
  received_at_laundry: ['inspection_required', 'processing', 'awaiting_customer_approval'],
  inspection_required: ['awaiting_customer_approval', 'processing', 'rejected', 'cancelled'],
  awaiting_customer_approval: ['processing', 'rejected', 'cancelled'],
  processing: ['ready_for_delivery', 'cancelled'],
  ready_for_delivery: ['delivery_assigned', 'out_for_delivery', 'completed'],
  delivery_assigned: ['out_for_delivery', 'ready_for_delivery'],
  out_for_delivery: ['delivered', 'delivery_assigned'],
  delivered: ['completed'],
  completed: [],
  cancelled: []
};

// Allowed roles per target status
const ROLE_PERMISSIONS: Partial<Record<OrderLifecycleStatus, string[]>> = {
  accepted: ['merchant_owner', 'merchant_staff', 'platform_admin', 'operations_manager'],
  rejected: ['merchant_owner', 'merchant_staff', 'platform_admin'],
  inspection_required: ['merchant_owner', 'merchant_staff', 'driver', 'platform_admin'],
  awaiting_customer_approval: ['merchant_owner', 'merchant_staff', 'platform_admin'],
  processing: ['merchant_owner', 'merchant_staff', 'customer', 'platform_admin'],
  ready_for_delivery: ['merchant_owner', 'merchant_staff', 'platform_admin'],
  delivery_assigned: ['dispatcher', 'platform_admin', 'operations_manager'],
  out_for_delivery: ['driver', 'dispatcher', 'platform_admin'],
  delivered: ['driver', 'platform_admin', 'dispatcher'],
  completed: ['driver', 'merchant_owner', 'platform_admin', 'operations_manager'],
  cancelled: ['customer', 'platform_admin', 'operations_manager', 'merchant_owner']
};

export class OrderStateMachine {
  static canTransition(from: OrderLifecycleStatus, to: OrderLifecycleStatus, actorRole: string): { allowed: boolean; reason?: string } {
    if (from === to) {
      return { allowed: false, reason: 'Order is already in the requested status' };
    }

    const permittedTargets = VALID_TRANSITIONS[from];
    if (!permittedTargets || !permittedTargets.includes(to)) {
      return {
        allowed: false,
        reason: `Invalid lifecycle transition from '${from}' to '${to}'`
      };
    }

    // Role check (admin can override operational state transitions)
    if (actorRole !== 'platform_admin') {
      const allowedRoles = ROLE_PERMISSIONS[to];
      if (allowedRoles && !allowedRoles.includes(actorRole)) {
        return {
          allowed: false,
          reason: `Role '${actorRole}' is not authorized to transition order to '${to}'`
        };
      }
    }

    return { allowed: true };
  }
}
